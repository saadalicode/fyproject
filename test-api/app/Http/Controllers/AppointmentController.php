<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    // Store an appointment
    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'patient_name' => 'required|string|max:255',
            'scheduler_name' => 'required|string|max:255',
            'appointment_date' => 'required|date',
            'appointment_status' => 'required|in:pending,reschedule,entertained',
            'doctor_name' => 'nullable|string|max:255',
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
        return response()->json(Appointment::all(), 200);
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
}

