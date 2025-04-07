<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppointmentAction extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_id',
        'action_type',
        'action_at',
        'remarks',
        'performed_by',
        'performed_by_role',
    ];

    // Relationships
    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    // Optionally: relationship to user (if all users are in a single users table)
    public function performer()
    {
        return $this->belongsTo(User::class, 'performed_by');
    }
}

