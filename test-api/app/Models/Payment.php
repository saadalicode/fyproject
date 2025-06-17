<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'appointment_id', 'stripe_payment_id', 'status', 'amount', 'currency'
    ];

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }
}

