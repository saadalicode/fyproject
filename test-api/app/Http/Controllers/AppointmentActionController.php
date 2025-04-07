<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\AppointmentAction;
use Illuminate\Http\Request;

class AppointmentActionController extends Controller
{
    // Cancel appointment (default role = patient)
    public function cancel(Request $request, $appointmentId)
    {
        $appointment = Appointment::findOrFail($appointmentId);

        $appointment->update([
            'appointment_status' => 'cancelled',
        ]);

        AppointmentAction::create([
            'appointment_id' => $appointment->id,
            'action_type' => 'cancelled',
            'remarks' => $request->input('remarks'),
            'performed_by' => null, // or you can set patient_id if available
            'performed_by_role' => 'patient',
        ]);

        return response()->json(['message' => 'Appointment cancelled successfully.']);
    }

    // Reschedule appointment (default role = patient)
    public function reschedule(Request $request, $appointmentId)
    {
        $appointment = Appointment::findOrFail($appointmentId);

        $newDate = $request->input('new_date');

        $appointment->update([
            'appointment_status' => 'reschedule',
            'appointment_date' => $newDate,
        ]);

        AppointmentAction::create([
            'appointment_id' => $appointment->id,
            'action_type' => 'rescheduled',
            'remarks' => $request->input('remarks'),
            'performed_by' => null,
            'performed_by_role' => 'patient',
        ]);

        return response()->json(['message' => 'Appointment rescheduled successfully.']);
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

