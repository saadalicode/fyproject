<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\DoctorBlockedDate;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;

class DoctorBlockedDateController extends Controller
{
    /* =========================
       Block a date
       POST /api/doctor/{doctor}/blocked-dates
       ========================= */
    public function store(Request $request, Doctor $doctor)
    {
        $rules = [
            'date' => 'required|date|after_or_equal:today',
        ];
        Validator::make($request->all(), $rules)->validate();

        $date = Carbon::parse($request->input('date'))->toDateString();
        $day  = Carbon::parse($date)->format('l');          // e.g. Tuesday

        // already blocked?
        if (
            DoctorBlockedDate::where('doctor_id', $doctor->id)
                             ->where('date', $date)
                             ->exists()
        ) {
            return response()->json(['message' => 'Date already blocked.'], 200);
        }

        // create block record
        DoctorBlockedDate::create([
            'doctor_id' => $doctor->id,
            'date'      => $date,
            'day'       => $day,
        ]);

        /* ---- auto‑cancel pending appointments on that date ---- */
        Appointment::where('doctor_id', $doctor->id)
                   ->where('appointment_date', $date)
                   ->where('appointment_status', 'pending')
                   ->update(['appointment_status' => 'cancelled']);

        return response()->json([
            'message' => 'Date blocked; pending appointments cancelled.',
        ]);
    }

    /* =========================
       Un‑block a date
       DELETE /api/doctor/{doctor}/blocked-dates/{date}
       ========================= */
    public function destroy(Doctor $doctor, $date)
    {
        $deleted = DoctorBlockedDate::where('doctor_id', $doctor->id)
                                    ->where('date', $date)
                                    ->delete();

        return response()->json([
            'message' => $deleted
                ? 'Date unblocked.'
                : 'No block record found for that date.',
        ]);
    }

    /* =========================
       Optional: list blocked dates for a doctor
       GET /api/doctor/{doctor}/blocked-dates
       ========================= */
    public function index(Doctor $doctor)
    {
        return response()->json($doctor->blockedDates()->pluck('date'));
    }
}

