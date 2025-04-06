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
            // Log::info('Incoming Request Data:', $request->all());
            // $imagePath = $image->storeAs('uploads/patinets', $imageName, 'public');
    
            // Create the public URL for the image
            // $imageURL = asset('storage/' . $imagePath);
    
            // if ($request->hasFile('image')) {
            //     $image = $request->file('image');
            //     $imageName = time() . '_' . $image->getClientOriginalName();
            //     $imagePath = $image->storeAs('uploads/patients', $imageName, 'public');
    
            //     Log::info('Image Successfully Uploaded: ' . $imagePath);
            // } else {
            //     Log::error('No Image Found in Request');
            //     return response()->json(['error' => 'Image is required'], 400);
            // }

            $imageName = 'patientByDefault.png';
            $destinationPath = 'uploads/patients/' . $imageName;

            // Generate the URL to access the image
            $imageURL = asset('storage/' . $destinationPath);
    
            $patient = Patient::create([
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'address' => $request->address,
                'image' => $imageURL,
            ]);
    
            User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'patient',
            ]);
    
            return response()->json(["message" => "New patient registered successfully.", "data" => $patient], 201);
    
        } catch (\Exception $e) {
            // Log::error('Error Storing Patient: ' . $e->getMessage());
    
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

    public function update(Request $request, $id)
    {
        $patient = Patient::find($id);
        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }

        $data = $request->only(['name', 'email', 'password']);

        if ($request->has('password')) {
            $data['password'] = Hash::make($request->password);
        }

        // Handle Image Update
        if ($request->hasFile('image')) {
            $request->validate(['image' => 'image|mimes:jpeg,png,jpg,gif|max:2048']);

            // Delete old image if exists
            if ($patient->image && Storage::exists($patient->image)) {
                Storage::delete($patient->image);
            }

            // Store new image
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('uploads/patients', $imageName, 'public');
            $data['image'] = $imagePath;
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

        $patient->delete();
        return response()->json(['message' => 'Patient deleted successfully']);
    }
}
