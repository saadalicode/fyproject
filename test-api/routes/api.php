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
// doctor sign up
Route::post('/doctor/signup', [DoctorsController::class, 'store']);
// shows all pending registration doctors
Route::get('/doctors/pending', [DoctorsController::class, 'pendingRegistrations']);
// registration of doctor accept by admin 
Route::post('doctors/registration/{id}', [DoctorsController::class, 'registration']);

// all registered patients
Route::get('/patients', [PatientsController::class, 'index']);
// add a new doctor by admin
Route::post('/addDoctor', [DoctorsController::class, 'create']);
// shows all existing doctors
Route::get('/doctors', [DoctorsController::class, 'index']);
// shows specific existing doctors
Route::get('/doctors/{id}', [DoctorsController::class, 'show']);
// shows doctor's existing data populated in an editable form
Route::get('/doctors/edit/{id}', [DoctorsController::class, 'edit']);
// to update the doctor data
Route::post('/doctors/update/{id}', [DoctorsController::class, 'update']);
// to delete the doctor 
Route::get('/doctors/delete/{id}', [DoctorsController::class, 'destroy']);


use App\Http\Controllers\AppointmentController;
// get the available appointments
Route::get('/doctor/weekly-slots/{id}', [AppointmentController::class, 'getWeeklySlots']);
Route::get('/reschedule/weekly-slots/{id}', [AppointmentActionController::class, 'getWeeklySlots']);
// show all of the appointments
Route::get('/appointments', [AppointmentController::class, 'index']);
// show specific appointment by id
Route::get('/appointments/{id}', [AppointmentController::class, 'show']);
// show all appointments to doctor
Route::get('/patients/appointments', [AppointmentController::class, 'showAppointment']);
// show specific appointment by patient name
Route::get('/appointment/detail', [AppointmentController::class, 'showPreviousAppointment']);
// create a new appointment
Route::post('/doctors/appointment', [AppointmentController::class, 'store']);
// update the current appointment
Route::put('/appointments/{id}/status', [AppointmentController::class, 'updateStatus']);

Route::post('/appointments/cancel/{appointmentId}', [AppointmentActionController::class, 'cancel']);
Route::post('/appointments/reschedule/{appointmentId}', [AppointmentActionController::class, 'reschedule']);

Route::middleware(['auth:sanctum'])->group(function () {
});



Route::get('/users', [UsersController::class, 'index']);
Route::post('/users', [UsersController::class, 'store']);
Route::get('/users/{id}', [UsersController::class, 'show']);
Route::put('/users/{id}', [UsersController::class, 'update']);
Route::delete('/users/{id}', [UsersController::class, 'destroy']);