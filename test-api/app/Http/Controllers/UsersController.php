<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Patient;
use App\Models\Doctor;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsersController extends Controller
{
    public function login(Request $request)
    {

    }
    public function index()
    {
        return response()->json(User::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:admin,doctor,patient',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json($user, 201);
    }

    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if($user->role == 'admin'){
            try {
                $admin = Admin::where('email', $user->email)->first();
                return response()->json([
                    'user' => $admin,
                    // 'token' => $token
                ], 200);
            } catch (\Exception $e) {
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
                    // 'token' => $token
                ], 200);
            } catch (\Exception $e) {
        
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
                    // 'token' => $token
                ], 200);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Login Failed',
                    'error' => $e->getMessage()
                ], 500);
            }
        }
        // return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

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

        $user->update($request->only(['name', 'email', 'password', 'role']));
        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}
