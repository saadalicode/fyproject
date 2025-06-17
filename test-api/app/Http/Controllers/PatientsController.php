<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;



class PatientsController extends Controller
{
    public function index()
    {
        return response()->json(Patient::all());
    }

    public function store(Request $request)
    {
        // Validate input data and capture any validation errors
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'required|string|regex:/^[0-9]{11}$/',
            'email' => 'required|string|email|max:255|unique:patients,email|unique:users,email',
            'password' => 'required|string|min:8',
            'address' => 'required|string',
            'image' => 'nullable|file|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // If validation fails, log the errors and return a response
        if ($validator->fails()) {
            Log::error('Validation Failed:', $validator->errors()->toArray());
            return response()->json(['error' => $validator->errors()], 422);
        } 

        try {
            // Check if the patient uploaded an image
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $imagePath = $image->storeAs('uploads/patients', $imageName, 'public');
                $imageURL = asset('storage/' . $imagePath);
            } else {
                // If no image was uploaded, use the default patient image
                $imageName = 'patientByDefault.png';
                $destinationPath = 'uploads/patients/' . $imageName;
                $imageURL = asset('storage/' . $destinationPath);
            }

            // Create the patient record
            $patient = Patient::create([
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'address' => $request->address,
                'image' => $imageURL,
            ]);

            // Create the user record (for authentication)
            User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'patient',
            ]);

            return response()->json(["message" => "New patient registered successfully.", "data" => $patient], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Patient not created',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function show($id)
    {
        $patient = Patient::find($id);
        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }
        return response()->json($patient);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
         $patient = Patient::findorfail($id);
        if(!$patient){
            return response()->json(['error', "Patient Not Found"], 404);
        }
        return response()->json($patient);
    }

    public function update(Request $request, $id)
    {
        $patient = Patient::find($id);
        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:11',
            'email' => 'sometimes|string|email|unique:patients,email,' . $patient->id,
            'password' => 'sometimes|string|min:8',
            'image' => 'sometimes|file|image|mimes:jpeg,png,jpg,gif|max:2048',
            'address' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }


         $data = $request->except('password', 'image');

        // Handle password update (if present)
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($patient->image) {
                $oldImagePath = str_replace(asset('storage') . '/', '', $patient->image);
                Storage::disk('public')->delete($oldImagePath);
            }

            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('uploads/pateints', $imageName, 'public');
            $data['image'] = asset('storage/' . $imagePath);
        }

        $patient->update($data);

        return response()->json($patient);
    }

    public function destroy($id)
    {
        $patient = Patient::find($id);
        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }

        // Delete image if exists
        if ($patient->image && Storage::exists($patient->image)) {
            Storage::delete($patient->image);
        }

        // Delete the related user by email (assuming email is unique)
        User::where('email', $patient->email)->delete();

        $patient->delete();
        return response()->json(['message' => 'Patient deleted successfully'], 200);
    }
}
