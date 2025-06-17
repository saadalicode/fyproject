<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DoctorBlockedDate extends Model
{
    protected $fillable = ['doctor_id', 'date', 'day'];

    /* --------- relationships -------- */
    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }
}

