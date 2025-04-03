<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $table = 'appointments';
    protected $primaryKey = 'appointment_id';
    protected $fillable = [
        'patient_id',
        'patient_name',
        'scheduler_name',
        'appointment_date',
        'appointment_status',
        'doctor_name',
        'disease',
        'doctor_remarks',
        'rating'
    ];

    protected $casts = [
        'appointment_date' => 'date',
    ];
}

