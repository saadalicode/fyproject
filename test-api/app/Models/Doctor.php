<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'password',
        'specialization',
        'experience',
        'working_days',
        'slots',
        'opening_hours',
        'closing_hours',
        'price',
        'address',
        'image',
        'location',
        'available',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'working_days' => 'array', // Store working days as array
        'slots' => 'array', // Store slots as array
    ];

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'doctor_id');
    }

    public function blockedDates()
    {
        return $this->hasMany(DoctorBlockedDate::class);
    }


}

