<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\PatientsController;
use App\Http\Controllers\DoctorsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AppointmentActionController;


Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});

// for login and logout
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
// Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// patient sign up
Route::post('/signup', [PatientsController::class, 'store']);
// all registered patients
Route::get('/patients', [PatientsController::class, 'index']);
// add a new doctor
Route::post('/addDoctor', [DoctorsController::class, 'store']);
// shows all existing doctors
Route::get('/doctors', [DoctorsController::class, 'index']);
// shows specific existing doctors
Route::get('/doctors/{id}', [DoctorsController::class, 'show']);


use App\Http\Controllers\AppointmentController;
// show all of the appointments
Route::get('/appointments', [AppointmentController::class, 'index']);
// show specific appointment by id
Route::get('/appointments/{id}', [AppointmentController::class, 'show']);
// show all appointments to doctor
Route::get('/doctor/appointments', [AppointmentController::class, 'showAppointment']);
// show specific appointment by patient name
Route::get('/appointment/detail', [AppointmentController::class, 'showPreviousAppointment']);
// create a new appointment
Route::post('/doctors/appointment', [AppointmentController::class, 'store']);
// update the current appointment
Route::put('/appointments/{id}/status', [AppointmentController::class, 'updateStatus']);

Route::put('/appointments/{id}/cancel', [AppointmentActionController::class, 'cancel']);
Route::put('/appointments/{id}/reschedule', [AppointmentActionController::class, 'reschedule']);

Route::middleware(['auth:sanctum'])->group(function () {
});



Route::get('/users', [UsersController::class, 'index']);
Route::post('/users', [UsersController::class, 'store']);
Route::get('/users/{id}', [UsersController::class, 'show']);
Route::put('/users/{id}', [UsersController::class, 'update']);
Route::delete('/users/{id}', [UsersController::class, 'destroy']);