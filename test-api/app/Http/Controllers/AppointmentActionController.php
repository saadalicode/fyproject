<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\User;
use App\Models\AppointmentAction;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class AppointmentActionController extends Controller
{
    

    public function getWeeklySlots(Request $request, $doctorId)
    {
        $fromDate = $request->query('from_date');

        if (!$fromDate) {
            return response()->json(['error' => 'Missing from_date parameter'], 400);
        }

        try {
            $startDate = Carbon::parse($fromDate)->addDay(); // start from next day
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid from_date'], 400);
        }

        $endDate = $startDate->copy()->addDays(6); // 7-day window after original date

        $doctor = Doctor::findOrFail($doctorId);

        $workingDays = is_string($doctor->working_days) ? json_decode($doctor->working_days, true) : $doctor->working_days;
        $slotsPerDay = is_string($doctor->slots) ? json_decode($doctor->slots, true) : $doctor->slots;

        if (!is_array($workingDays) || !is_array($slotsPerDay)) {
            return response()->json(['error' => 'Invalid working_days or slots format'], 500);
        }

        $appointments = Appointment::where('doctor_id', $doctorId)
            ->whereBetween('appointment_date', [$startDate->toDateString(), $endDate->toDateString()])
            ->where('appointment_status', 'pending')
            ->get();

        $weeklySlots = [];

        foreach ($workingDays as $index => $dayName) {
            $totalSlots = (int) ($slotsPerDay[$index] ?? 0);

            // For each working day, find the next occurrence between startDate and endDate
            $currentDate = $startDate->copy();
            while ($currentDate->lte($endDate)) {
                if ($currentDate->format('l') === $dayName) {
                    $dayDateStr = $currentDate->toDateString();
                    $bookedCount = $appointments->where('appointment_date', $dayDateStr)->count();

                    $weeklySlots[] = [
                        'day' => $dayName,
                        'date' => $dayDateStr,
                        'availableSlots' => max(0, $totalSlots - $bookedCount),
                        'bookedSlots' => $bookedCount,
                        'totalSlots' => $totalSlots,
                    ];
                    break; // found the next occurrence, no need to look further
                }
                $currentDate->addDay();
            }
        }

        return response()->json([
            'reschedulableDays' => $weeklySlots
        ]);
    }


    // Cancel appointment function
    public function cancel(Request $request, $appointmentId)
    {
        // Find the original appointment
        $appointment = Appointment::findOrFail($appointmentId);
        
        // Get user data from request
        $performedById = $request->input('performed_by');
        $performedByRole = $request->input('performed_by_role');
        
        // Validate user existence
        if($performedByRole === "patient"){
            $loggedInUser = \App\Models\Patient::find($performedById); 
        }
        else if($performedByRole === "admin"){
            $loggedInUser = \App\Models\Admin::find($performedById); 
        }
        else if($performedByRole === "doctor"){
            $loggedInUser = Doctor::find($performedById); 
        }
        else {
            return response()->json(['error' => 'Invalid role specified.'], 400);
        }

        
        $user = User::where('email', $loggedInUser->email)->first();
        
        if (!$user || $user->role !== $performedByRole) {
            return response()->json(['error' => 'Invalid user performing this action.'], 403);
        }
        
        // Create AppointmentAction log
        AppointmentAction::create([
            'appointment_id' => $appointment->id,
            'action_type' => 'cancelled',
            'remarks' => $request->input('remarks'),
            'performed_by' => $performedById,
            'performed_by_role' => $performedByRole,
        ]);

        // Mark the original appointment as cancelled
        $appointment->update([
            'appointment_status' => 'cancelled',
        ]);
        
        return response()->json(['message' => 'Appointment cancelled successfully.']);
    }


    // Reschedule appointment function
    public function reschedule(Request $request, $appointmentId)
    {
        $appointment = Appointment::findOrFail($appointmentId);
        $selectedDay = $request->input('selected_day');
        $nextAppointmentDate = $request->input('selected_date');

        //  getting corresponding doctor with working days
        $doctor = $request->input('doctor_id');
        $selectedDoctor = \App\Models\Doctor::findOrFail($doctor);
        
        // Validate selected day
        if (!$selectedDoctor) {
            return response()->json(['error' => 'Doctor not found.'], 404);
        }

        $workingDays = $selectedDoctor->working_days;

        if (empty($workingDays) || !in_array($selectedDay, $workingDays)) {
            return response()->json(['error' => 'Selected day is not available for this doctor.'], 400);
        }



        // Get user data from request
        $performedById = $request->input('performed_by');
        $performedByRole = $request->input('performed_by_role');

        // Validate user existence
        if($performedByRole === "patient"){
            $loggedInUser = \App\Models\Patient::find($performedById); 
        }
        else if($performedByRole === "admin"){
            $loggedInUser = \App\Models\Admin::find($performedById); 
        }
        else if($performedByRole === "doctor"){
            $loggedInUser = Doctor::find($performedById); 
        }

        $user = User::where('email', $loggedInUser->email)->first();

        if (!$user || $user->role !== $performedByRole) {
            return response()->json(['error' => 'Invalid user performing this action.'], 403);
        }

        // Create AppointmentAction log
        AppointmentAction::create([
            'appointment_id' => $appointment->id,
            'action_type' => 'rescheduled',
            'remarks' => $request->input('remarks'),
            'performed_by' => $performedById,
            'performed_by_role' => $performedByRole,
        ]);

        // Create new rescheduled appointment
        $newAppointment = Appointment::create([
            'patient_id' => $appointment->patient_id,
            'doctor_id' => $appointment->doctor_id,
            'appointment_date' => $nextAppointmentDate,
            'appointment_status' => 'pending',
            'patient_name' => $user->name,
        ]);

        // Update current appointment
        $appointment->update([
            'appointment_status' => 'rescheduled',
        ]);

       

        return response()->json([
            'message' => 'Appointment rescheduled successfully.',
            'newAppointment' => $newAppointment
        ]);
    }


    // Custom function to get the next available day for rescheduling
    private function getAvailableDaysThisWeek($selectedDay)
    {
        $today = Carbon::today();
        $selectedDayIndex = Carbon::parse($selectedDay)->dayOfWeek;

        // Start of the current week (Sunday)
        $startOfWeek = $today->copy()->startOfWeek();

        // Loop from today to end of this week
        for ($i = 0; $i < 7; $i++) {
            $checkDate = $startOfWeek->copy()->addDays($i);
            if ($checkDate->dayOfWeek === $selectedDayIndex && $checkDate->gte($today)) {
                return $checkDate->format('Y-m-d');
            }
        }

        return null; // No slot found this week
    }

    
}


// namespace App\Http\Controllers;

// use App\Models\Appointment;
// use App\Models\AppointmentAction;
// use Illuminate\Http\Request;

// class AppointmentActionController extends Controller
// {
//     // Cancel appointment
//     public function cancel(Request $request, $appointmentId)
//     {
//         $appointment = Appointment::findOrFail($appointmentId);

//         // Update appointment status
//         $appointment->update(['appointment_status' => 'cancelled']);

//         // Log the action
//         AppointmentAction::create([
//             'appointment_id' => $appointment->id,
//             'action_type' => 'cancelled',
//             'remarks' => $request->input('remarks'),
//             'performed_by' => auth()->id(),
//             'performed_by_role' => auth()->user()->role, // Make sure 'role' exists on user model
//         ]);

//         return response()->json(['message' => 'Appointment cancelled successfully.']);
//     }

//     // Reschedule appointment
//     public function reschedule(Request $request, $appointmentId)
//     {
//         $appointment = Appointment::findOrFail($appointmentId);

//         $newDate = $request->input('new_date');

//         $appointment->update([
//             'appointment_status' => 'reschedule',
//             'appointment_date' => $newDate,
//         ]);

//         AppointmentAction::create([
//             'appointment_id' => $appointment->id,
//             'action_type' => 'rescheduled',
//             'remarks' => $request->input('remarks'),
//             'performed_by' => auth()->id(),
//             'performed_by_role' => auth()->user()->role,
//         ]);

//         return response()->json(['message' => 'Appointment rescheduled successfully.']);
//     }
// }

