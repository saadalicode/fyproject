<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Appointment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class DoctorsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Doctor::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:11',
            'email' => 'required|string|email|unique:doctors,email',
            'password' => 'required|string|min:8',
            'specialization' => 'required|string',
            'experience' => 'nullable|integer',
            'opening_hours' => 'required|date_format:H:i:s',
            'closing_hours' => 'required|date_format:H:i:s',
            'price' => 'required|numeric',
            'address' => 'required|string',
            'image' => 'required|file|image|mimes:jpeg,png,jpg,gif|max:2048',
            'working_days' => 'required|string',
            'slots' => 'required|string',
            'location' => 'required|string',
        ]);
    
        if ($validator->fails()) {
            // Log::error('Validation Failed:', $validator->errors()->toArray());
            return response()->json(['error' => $validator->errors()], 422);
        }
    
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('uploads/doctors', $imageName, 'public');
    
            // Create the public URL for the image
            $imageURL = asset('storage/' . $imagePath);
    
            // Process and store the working days and slots
            // $workingDays = explode(" ", $request->working_days); // Convert to array
            // $slots = explode(" ", $request->slots); // Convert to array

            // Decode JSON inputs
            $workingDays = json_decode($request->working_days, true);
            $slots = json_decode($request->slots, true);

             // Determine if the doctor is available
            $available = collect($slots)->contains(fn($slot) => $slot > 0);

            $doctor = Doctor::create([
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'specialization' => $request->specialization,
                'experience' => $request->experience,
                'working_days' => $workingDays,
                'slots' => $slots,
                'opening_hours' => $request->opening_hours,
                'closing_hours' => $request->closing_hours,
                'price' => $request->price,
                'address' => $request->address,
                'image' => $imageURL,
                'location' => $request->location, 
                'available' => $available,     
            ]);
    
            User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'doctor',
            ]);
            
            return response()->json(['message' => 'Doctor created successfully', 'doctor' => $doctor], 201);
        } else {
            return response()->json(['error' => 'Image is required'], 400);
        }
    }

   
    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $doctor = Doctor::findorfail($id);
        if(!$doctor){
            return response()->json(['error', "Doctor Not Found"], 404);
        }
        return response()->json($doctor);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
         $doctor = Doctor::findorfail($id);
        if(!$doctor){
            return response()->json(['error', "Doctor Not Found"], 404);
        }
        return response()->json($doctor);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $doctor = Doctor::findorfail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:11',
            'email' => 'sometimes|string|email|unique:doctors,email,' . $doctor->id,
            'password' => 'sometimes|string|min:8',
            'specialization' => 'sometimes|string',
            'experience' => 'nullable|integer',
            'opening_hours' => 'sometimes|date_format:H:i:s',
            'closing_hours' => 'sometimes|date_format:H:i:s',
            'price' => 'sometimes|numeric',
            'address' => 'sometimes|string',
            'image' => 'sometimes|file|image|mimes:jpeg,png,jpg,gif|max:2048',
            'working_days' => 'sometimes|string',
            'slots' => 'sometimes|string',
            'location' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $data = $request->except('password', 'image', 'working_days', 'slots');

        // Handle password update (if present)
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        // Handle working_days and slots (if provided as JSON string)
        if ($request->has('working_days')) {
            $workingDays = json_decode($request->working_days, true);
            $data['working_days'] = $workingDays;
        }

        if ($request->has('slots')) {
            $slots = json_decode($request->slots, true);
            $data['slots'] = $slots;

            // Update availability
            $data['available'] = collect($slots)->contains(fn($slot) => $slot > 0);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($doctor->image) {
                $oldImagePath = str_replace(asset('storage') . '/', '', $doctor->image);
                Storage::disk('public')->delete($oldImagePath);
            }

            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('uploads/doctors', $imageName, 'public');
            $data['image'] = asset('storage/' . $imagePath);
        }

        // Update doctor record
        $doctor->update($data);

        return response()->json([
            'message' => 'Doctor updated successfully.',
            'data' => $doctor
        ], 200);
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Find the doctor
        $doctor = Doctor::find($id);

        if (!$doctor) {
            return response()->json(['error' => 'Doctor not found'], 404);
        }

        // Delete the image file from storage
        if ($doctor->image) {
            // Extract path from public URL like: http://127.0.0.1:8000/storage/uploads/doctors/image.jpg
            $relativePath = str_replace(asset('storage') . '/', '', $doctor->image);

            if (Storage::disk('public')->exists($relativePath)) {
                Storage::disk('public')->delete($relativePath);
            }
        }

        // Delete the related user by email (assuming email is unique)
        User::where('email', $doctor->email)->delete();

        // Delete the doctor record
        $doctor->delete();

        return response()->json(['message' => 'Doctor deleted successfully'], 200);
    }


     /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:11',
            'email' => 'required|string|email|unique:doctors,email',
            'password' => 'required|string|min:8',
            'specialization' => 'required|string',
            'experience' => 'nullable|integer',
            'opening_hours' => 'required|date_format:H:i:s',
            'closing_hours' => 'required|date_format:H:i:s',
            'price' => 'required|numeric',
            'address' => 'required|string',
            'image' => 'required|file|image|mimes:jpeg,png,jpg,gif|max:2048',
            'working_days' => 'required|string',
            'slots' => 'required|string',
            'location' => 'required|string',
        ]);
    
        if ($validator->fails()) {
            // Log::error('Validation Failed:', $validator->errors()->toArray());
            return response()->json(['error' => $validator->errors()], 422);
        }
    
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('uploads/doctors', $imageName, 'public');
    
            // Create the public URL for the image
            $imageURL = asset('storage/' . $imagePath);

            // Decode JSON inputs
            $workingDays = json_decode($request->working_days, true);
            $slots = json_decode($request->slots, true);

             // Determine if the doctor is available
            $available = collect($slots)->contains(fn($slot) => $slot > 0);

            $doctor = Doctor::create([
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'specialization' => $request->specialization,
                'experience' => $request->experience,
                'working_days' => $workingDays,
                'slots' => $slots,
                'opening_hours' => $request->opening_hours,
                'closing_hours' => $request->closing_hours,
                'price' => $request->price,
                'address' => $request->address,
                'image' => $imageURL,
                'location' => $request->location, 
                'available' => $available,     
            ]);
            
            return response()->json(['message' => 'Admin will approve your request soon! Wait till for Login!', 'doctor' => $doctor], 201);
        } else {
            return response()->json(['error' => 'Image is required'], 400);
        }
    }
    


    /**
     * Show the form for editing the specified resource.
     */
    public function pendingRegistrations()
    {
        // Get all emails from the users table
        $registeredEmails = User::pluck('email')->toArray();

        // Get doctors whose emails are NOT in the users table
        $pendingDoctors = Doctor::whereNotIn('email', $registeredEmails)->get();

        if ($pendingDoctors->isEmpty()) {
            return response()->json(['message' => 'No pending registrations found'], 200);
        }

        return response()->json(['pending_doctors' => $pendingDoctors], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function registration(Request $request,$id)
    {
        $doctor = Doctor::findorfail($id);
        if(!$doctor){
            return response()->json(['error', "Doctor Not Found"], 404);
        }

        User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'doctor',
            ]);
            
        return response()->json(['message' => 'Doctor created successfully', 'doctor' => $doctor], 201);
    }
}
