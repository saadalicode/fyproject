<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AppointmentController extends Controller
{
    public function getWeeklySlots($doctorId)
    {
        $today = Carbon::today();

        // Define a 7-day week window starting from today
        $startOfCurrentWeek = $today->copy();
        $endOfCurrentWeek = $today->copy()->addDays(6); // Today + 6 days = full 7-day window

        // Fetch doctor
        $doctor = Doctor::findOrFail($doctorId);

        // Decode working_days and slots if stored as JSON strings
        $workingDays = is_string($doctor->working_days) ? json_decode($doctor->working_days, true) : $doctor->working_days;
        $slotsPerDay = is_string($doctor->slots) ? json_decode($doctor->slots, true) : $doctor->slots;

        // Ensure data is valid
        if (!is_array($workingDays) || !is_array($slotsPerDay)) {
            return response()->json(['error' => 'Invalid working_days or slots format'], 500);
        }

        // Appointments within the next 7 days
        $appointments = Appointment::where('doctor_id', $doctorId)
            ->whereBetween('appointment_date', [$startOfCurrentWeek->toDateString(), $endOfCurrentWeek->toDateString()])
            ->where('appointment_status', 'pending')
            ->get();

        $results = [
            'currentWeek' => [],
        ];

        // Loop through working days and compute slots
        foreach ($workingDays as $index => $dayName) {
            $totalSlots = (int) ($slotsPerDay[$index] ?? 0);

            // Get date for this weekday within current week, starting from today
            $dayDate = Carbon::parse($startOfCurrentWeek)->copy()->modify("this $dayName");

            // Skip if the computed date is outside the 7-day range
            if ($dayDate->lt($today) || $dayDate->gt($endOfCurrentWeek)) {
                continue;
            }

            $dayDateStr = $dayDate->toDateString();

            // Count how many appointments are booked on this date
            $bookedCount = $appointments->where('appointment_date', $dayDateStr)->count();

            $availableSlots = max(0, $totalSlots - $bookedCount);

            // Update availability flag
            if ($availableSlots > 0) {
                $isDoctorAvailable = true;
            }

            $results['currentWeek'][] = [
                'day' => $dayName,
                'date' => $dayDateStr,
                'availableSlots' => $availableSlots,
                'totalSlots' => $totalSlots,
                'bookedSlots' => $bookedCount
            ];
        }

        // Update the doctor's availability in DB
        $doctor->available = $isDoctorAvailable;
        $doctor->save();

        return response()->json($results);
    }


    // Store an appointment
    public function store(Request $request)
    {
        $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'patient_id' => 'required|exists:patients,id',
            'patient_name' => 'nullable|string|max:255',
            'patient_father_name' => 'nullable|string|max:255',
            'patient_age' => 'nullable|integer',
            'appointment_date' => 'required|date',
            'appointment_status' => 'required|in:pending,reschedule,entertained,cancelled',
            'disease' => 'nullable|string',
            'doctor_remarks' => 'nullable|string',
            'rating' => 'nullable|integer|min:0|max:5',
        ]);

        // try {
        //     // Get the doctor's available working days and slots
        //     $doctor = Doctor::findOrFail($request->doctor_id);
        //     $workingDays = $doctor->working_days; // e.g., ["Monday", "Wednesday"]
        //     $slots = $doctor->slots; // e.g., ["10", "10"]
            
        //     // Get today’s day and format it to match the doctor's working days
        //     $today = Carbon::today()->format('l'); // e.g., "Wednesday"
            
        //     // Find today’s working day and corresponding slot availability
        //     $workingDayIndex = array_search($today, $workingDays);
        //     $appointmentDate = $request->appointment_date;
            
        //     // Check if today is a working day and if slots are available
        //     if ($workingDayIndex !== false && isset($slots[$workingDayIndex]) && $slots[$workingDayIndex] > 0) {
        //         // If slots are available for today, book the appointment for today
        //         $appointmentDate = Carbon::today();
        //         // $slots[$workingDayIndex] -= 1; // Decrease the slot for today
        //     } else {
        //         // If today is not available, find the next available working day
        //         $foundNextAvailable = false;
                
        //         // Loop through the working days to find the next available day
        //         foreach ($workingDays as $index => $day) {
        //             if (Carbon::parse($day)->isAfter(Carbon::today()) && $slots[$index] > 0) {
        //                 $appointmentDate = Carbon::parse($day)->next(); // Get the next available working day
        //                 // $slots[$index] -= 1; // Decrease slot for the next available day
        //                 $foundNextAvailable = true;
        //                 break;
        //             }
        //         }
                
        //         // If no future working days were available, return an error message
        //         if (!$foundNextAvailable) {
        //             return response()->json(['error' => 'No available slots for the selected working days.'], 400);
        //         }
        //     }

            // Create the appointment
            $appointment = Appointment::create([
                'doctor_id' => $request->doctor_id,
                'patient_id' => $request->patient_id,
                'appointment_date' => $request->appointment_date,  // Set the appointment date to the selected date
                'appointment_status' => 'pending', // Default status
                'patient_name' => $request->patient_name,
                'patient_father_name' => $request->patient_father_name,
                'patient_age' => $request->patient_age,
                'disease' => $request->disease,
                'doctor_remarks' => $request->doctor_remarks,
                'rating' => $request->rating,
            ]);
            
            // Save the updated slots and availability for the doctor
            // $doctor->slots = $slots;
            // $doctor->available = collect($slots)->contains(fn($slot) => $slot > 0); // true if any slot > 0
            // $doctor->save();

            
            return response()->json([
                'message' => 'Appointment created successfully',
                'appointment' => $appointment
            ], 201);
        // } 
        // catch (\Exception $error) {
        //     return response()->json(['error' => $error->getMessage()], 500);
        // }
    }


    // Fetch all appointments
    public function index()
    {
        $appointments = Appointment::with('patient')->get();

        return response()->json($appointments);
    }

    // Display the specific appointment
    public function show($id)
    {
        $appointment = Appointment::with(['doctor', 'patient'])->findOrFail($id);

        return response()->json( $appointment);
    }

    // Update appointment status
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'appointment_status' => 'required|in:pending,reschedule,entertained,cancelled',
            'patient_name' => 'nullable|string|max:255',
            'patient_father_name' => 'nullable|string|max:255',
            'patient_age' => 'nullable|integer',
            'disease' => 'nullable|string',
            'doctor_remarks' => 'nullable|string',
            'rating' => 'nullable|integer|min:0|max:5',
        ]);

        // Retrieve the current status of the appointment from the request
        $currentStatus = $request->input('appointment_status'); 

        try {
            // Fetch the appointment by its ID
            $appointment = Appointment::findOrFail($id);

            // Only update if the status is "entertained"
            if ($currentStatus == 'entertained') {

                // If the status is changing to "entertained", ensure that required fields are provided
                $request->validate([
                    'patient_name' => 'required|string|max:255',
                    'patient_father_name' => 'required|string|max:255',
                    'patient_age' => 'required|integer',
                ]);

                // Update all the appointment details 
                $appointment->update([
                    'patient_name' => $request->patient_name,
                    'patient_father_name' => $request->patient_father_name,
                    'patient_age' => $request->patient_age,
                    'appointment_status' => $request->appointment_status,
                    'disease' => $request->disease,
                    'doctor_remarks' => $request->doctor_remarks,
                ]);
            }

            return response()->json([
                'message' => 'Appointment status updated successfully',
                'appointment' => $appointment
            ], 200);

        } catch (\Exception $error) {
            return response()->json(['error' => $error->getMessage()], 500);
        }
    }


    // it returns the pending appointments  
    public function showAppointment()
    {
        // Get all appointments with 'pending' status along with the patient details
        $appointments = Appointment::with('patient')  // Eager load patient relation
                                ->where('appointment_status', 'pending')  // Filter appointments with 'pending' status
                                ->get();
                                
        // Map the appointments to include patient name directly if needed
        //  $appointments = $appointments->map(function ($appointment) {
        //     $appointment->schedular_name = $appointment->patient->name;  // Accessing patient name from the relation
        //     return $appointment;
        // });

        if ($appointments->isEmpty()) {
            return response()->json(["message" => "No pending appointments found"], 400);
        }

        return response()->json($appointments);
    }

    // it returns the entertained appointments which searched by patient name
    public function showPreviousAppointment(Request $request)
    {
        // Get the patient name from query parameter (e.g., ?patient_name=Fiona Green)
        $patientName = $request->input('patient_name');

        // Get appointments that match the patient name and include related patient and doctor details
        $appointments = Appointment::with(['doctor', 'patient'])
            ->where('patient_name', $patientName)
            ->where('appointment_status', 'entertained')
            ->get();

            // qurey for  partial matches e.g Fiona 
            // ->where('patient_name', 'LIKE', '%' . $patientName . '%')

        if ($appointments->isEmpty()) {
            return response()->json(["patient name" => $patientName, "message" => "No appointments found for this patient"], 404);
        }

        return response()->json($appointments);
    }

}

