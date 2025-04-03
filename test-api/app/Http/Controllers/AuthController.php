<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Patient;
use App\Models\Doctor;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Validate input
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Find user by email
        $user = User::where('email', $request->email)->first();

        // Check if user exists and password matches
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid email or password'], 401);
        }

        // Create a new token for authentication
        // $token = $user->createToken('auth_token')->plainTextToken;
        if($user->role == "admin"){
            $admin = Admin::where('emial', $user->email)->first();
            return response()->json([
                'message' => 'Login successful',
                'user' => $admin,
                // 'token' => $token
            ], 200);
        }
        elseif($user->role == "doctor"){
            $doctor = Doctor::where('emial', $user->email)->first();
            return response()->json([
                'message' => 'Login successful',
                'user' => $doctor,
                // 'token' => $token
            ], 200);

        }
        else{
            $patient = Patient::where('email', $user->email)->first();
            return response()->json([
                'message' => 'Login successful',
                'user' => $patient,
                // 'token' => $token
            ], 200);
        }

    }

    public function logout(Request $request)
    {
        // Revoke the token of the authenticated user
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logout successful'], 200);
    }
}

