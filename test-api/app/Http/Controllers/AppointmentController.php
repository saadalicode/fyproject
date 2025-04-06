<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    // Store an appointment
    public function store(Request $request)
    {
        $request->validate([
            'doctor_id' => 'required|exists:doctors,id',  
            'patient_id' => 'required|exists:patients,id',
            'patient_name' => 'required|string|max:255',
            'scheduler_name' => 'required|string|max:255',
            'appointment_date' => 'required|date',
            'appointment_status' => 'required|in:pending,reschedule,entertained',
            'disease' => 'nullable|string|max:255',
            'doctor_remarks' => 'nullable|string',
            'rating' => 'nullable|integer|min:0|max:5',
        ]);

        $appointment = Appointment::create($request->all());

        return response()->json([
            'message' => 'Appointment created successfully',
            'appointment' => $appointment
        ], 201);
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
            'appointment_status' => 'required|in:pending,reschedule,entertained'
        ]);

        $appointment = Appointment::findOrFail($id);
        $appointment->update(['appointment_status' => $request->appointment_status]);

        return response()->json([
            'message' => 'Appointment status updated successfully',
            'appointment' => $appointment
        ], 200);
    }

    public function showAppointment()
{
    // Get all appointments with 'pending' status along with the patient details
    $appointments = Appointment::with('patient')  // Eager load patient relation
                               ->where('appointment_status', 'pending')  // Filter appointments with 'pending' status
                               ->get();
     // Map the appointments to include patient name directly if needed
     $appointments = $appointments->map(function ($appointment) {
        $appointment->schedular_name = $appointment->patient->name;  // Accessing patient name from the relation
        return $appointment;
    });

    if ($appointments->isEmpty()) {
        return response()->json(["message" => "No pending appointments found"], 400);
    }

    return response()->json($appointments);
}

}

