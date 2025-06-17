<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));
    }

    /* ---------------- create intent ---------------- */
    public function createIntent(Request $req)
    {
        Log::info($req->all());

        $req->validate([
            'amount'           => 'required|integer|min:100', // paisa
            'doctor_id'        => 'required|exists:doctors,id',
            'patient_id'       => 'required|exists:patients,id',
            'appointment_date' => 'required|date',
        ]);

        // 1.  create payment‑intent
        try{
            $intent = PaymentIntent::create([
            'amount'   => $req->amount,
            'currency' => 'pkr',
            'metadata' => [
                'doctor_id'        => $req->doctor_id,
                'patient_id'       => $req->patient_id,
                'appointment_date' => $req->appointment_date,
            ],
        ]);
        } catch (\Exception $e) {
                Log::error('Stripe Payment Intent Error: ' . $e->getMessage());
        return response()->json(['error' => $e->getMessage()], 500);
    }

        // 2.  store a PENDING record
        Payment::create([
            'stripe_payment_id' => $intent->id,
            'status'            => 'processing',
            'amount'            => $req->amount,
            'currency'          => 'pkr',
        ]);

        return response()->json(['clientSecret' => $intent->client_secret]);
    }

    /* ---------------- confirm intent ---------------- */
    public function confirmIntent(Request $req)
    {
        $req->validate(['payment_intent_id' => 'required|string']);

        $intent = PaymentIntent::retrieve($req->payment_intent_id);

        // Guard
        if ($intent->status !== 'succeeded') {
            return response()->json(['message' => 'Payment not completed'], 400);
        }

        /* 1️⃣  mark payment row */
        $payment = Payment::where('stripe_payment_id', $intent->id)->first();
        $payment->update(['status' => 'succeeded']);

        /* 2️⃣  create appointment */
        $appointment = Appointment::create([
            'doctor_id'        => $intent->metadata->doctor_id,
            'patient_id'       => $intent->metadata->patient_id,
            'appointment_date' => $intent->metadata->appointment_date,
            'appointment_status' => 'confirmed',
        ]);

        // link payment ↔ appointment
        $payment->appointment_id = $appointment->id;
        $payment->save();

        return response()->json(['message' => 'Appointment booked', 'appointment' => $appointment]);
    }
}
