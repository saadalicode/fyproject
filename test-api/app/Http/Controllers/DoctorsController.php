<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class DoctorsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
            'password' => 'required|string|min:6',
            'specialization' => 'required|string',
            'experience' => 'nullable|integer',
            'working_days' => 'required|string',           
            'slots' => 'required|json',
            'opening_hours' => 'required|date_format:H:i:s',
            'closing_hours' => 'required|date_format:H:i:s',
            'price' => 'required|numeric',
            'address' => 'required|string',
            'image' => 'required|file|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            Log::error('Validation Failed:', $validator->errors()->toArray());
            return response()->json(['error' => $validator->errors()], 422);
        }

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('uploads/doctors', $imageName, 'public');

            // Log::info('Image Successfully Uploaded: ' . $imagePath);
        } else {
            // Log::error('No Image Found in Request');
            return response()->json(['error' => 'Image is required'], 400);
        }

        $doctor = Doctor::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'specialization' => $request->specialization,
            'experience' => $request->experience,
            'working_days' => $request->working_days,
            'slots' => $request->slots,
            'opening_hours' => $request->opening_hours,
            'closing_hours' => $request->closing_hours,
            'price' => $request->price,
            'address' => $request->address,
            'image' => $request->image,
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'doctor',
        ]);
        
        return response()->json(['message' => 'Doctor created successfully', 'doctor' => $doctor], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Doctor $doctor)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Doctor $doctor)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Doctor $doctor)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Doctor $doctor)
    {
        //
    }
}
