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
        if($user){
            if(!Hash::check($request->password, $user->password)){
                return response()->json(['message' => 'Invalid password.'], 401);
            }
        }
        else {
            return response()->json(['message' => 'Invalid email.'], 401);
        }

        // return response()->json($user);
        
        // Create a new token for authentication
        // $token = $user->createToken('auth_token')->plainTextToken;
        if($user->role == 'admin'){
            try {
                $admin = Admin::where('email', $user->email)->first();
                return response()->json([
                    'user' => $admin,
                    'role' => $user->role
                    // 'token' => $token
                ], 200);
            } catch (\Exception $e) {
                // Log::error('Error Storing Patient: ' . $e->getMessage());
        
                return response()->json([
                    'message' => 'Login Failed',
                    'error' => $e->getMessage()
                ], 500);
            }
        }
        else if($user->role == 'doctor'){
            try {
                $doctor = Doctor::where('email', $user->email)->first();
                return response()->json([
                    'user' => $doctor,
                    'role' => $user->role
                    // 'token' => $token
                ], 200);
            } catch (\Exception $e) {
                // Log::error('Error Storing Patient: ' . $e->getMessage());
        
                return response()->json([
                    'message' => 'Login Failed',
                    'error' => $e->getMessage()
                ], 500);
            }

        }
        else{
            try {
                $patient = Patient::where('email', $user->email)->first();
                return response()->json([
                    'user' => $patient,
                    'role' => $user->role
                    // 'token' => $token
                ], 200);
            } catch (\Exception $e) {
                // Log::error('Error Storing Patient: ' . $e->getMessage());
        
                return response()->json([
                    'message' => 'Login Failed',
                    'error' => $e->getMessage()
                ], 500);
            }
        }

    }

    public function logout(Request $request)
    {
        // Revoke the token of the authenticated user
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logout successful'], 200);
    }
}

