<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $table = 'appointments';
    protected $primaryKey = 'id';

    protected $fillable = [
        'patient_id',
        'patient_name',
        'scheduler_name',
        'appointment_date',
        'appointment_status',
        'doctor_id',
        'disease',
        'doctor_remarks',
        'rating'
    ];

    protected $casts = [
        'appointment_date' => 'date',
    ];

    // This will return 'Y-m-d' format
    public function getAppointmentDateAttribute()
    {
        return $this->attributes['appointment_date']
            ? \Carbon\Carbon::parse($this->attributes['appointment_date'])->format('Y-m-d')
            : null;
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'doctor_id');
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }
}
