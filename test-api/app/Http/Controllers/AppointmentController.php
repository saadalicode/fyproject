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

        try{
            $appointment = Appointment::create($request->all());
    
            return response()->json([
                'message' => 'Appointment created successfully',
                'appointment' => $appointment
            ], 201);
        } catch (\Exception $error){
            return response()->json(['error' => $error], 200);
        }

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
        $currentStatus = $request->input('appointment_status');

        try{
            $appointment = Appointment::findOrFail($id);
    
            if($currentStatus == 'entertained'){
                $appointment->update(['patient_name' => $request->patient_name]);
                $appointment->update(['patient_father_name' => $request->patient_father_name]);
                $appointment->update(['patient_age' => $request->patient_age]);
                $appointment->update(['appointment_status' => $request->appointment_status]);
                $appointment->update(['disease' => $request->disease]);
                $appointment->update(['doctor_remarks' => $request->doctor_remarks]);
            }
            else if($currentStatus == 'reschedule'){
                $appointment->update(['appointment_status' => $request->appointment_status]);
            }
    
            return response()->json([
                'message' => 'Appointment status updated successfully',
                'appointment' => $appointment
            ], 201);
        } catch (\Exception $error){
            return response()->json(['error' => $error], 200);
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

