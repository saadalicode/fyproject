
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id('id');
            $table->unsignedBigInteger('doctor_id'); // Changed from string to unsignedBigInteger
            $table->unsignedBigInteger('patient_id');
            $table->string('patient_name')->nullable();
            $table->string('patient_father_name')->nullable(); // NEW
            $table->integer('patient_age')->nullable(); 
            $table->date('appointment_date');
            $table->enum('appointment_status', ['pending', 'rescheduled', 'entertained', 'cancelled'])->default('pending');
            $table->string('disease')->nullable();
            $table->text('doctor_remarks')->nullable();
            $table->tinyInteger('rating')->default(0)->comment('Rating from 0 to 5');
            $table->timestamps();

            // Foreign Key Constraints
            $table->foreign('patient_id')->references('id')->on('patients')->onDelete('cascade');
            $table->foreign('doctor_id')->references('id')->on('doctors')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};

// <?php

// use Illuminate\Database\Migrations\Migration;
// use Illuminate\Database\Schema\Blueprint;
// use Illuminate\Support\Facades\Schema;

// return new class extends Migration {
//     public function up(): void
//     {
//         Schema::create('appointments', function (Blueprint $table) {
//             $table->id('appointment_id');
//             $table->unsignedBigInteger('patient_id');
//             $table->string('patient_name')->nullable();
//             $table->string('scheduler_name');
//             $table->date('appointment_date');
//             $table->enum('appointment_status', ['pending', 'reschedule', 'entertained', 'cancelled'])->default('pending');
//             $table->string('doctor_id');
//             $table->string('disease');
//             $table->text('doctor_remarks')->nullable();
//             $table->tinyInteger('rating')->default(0)->comment('Rating from 0 to 5');
//             $table->timestamps();

//             // Foreign Key Constraint (if patients table exists)
//             $table->foreign('patient_id')->references('id')->on('patients')->onDelete('cascade');
//         });
//     }

//     public function down(): void
//     {
//         Schema::dropIfExists('appointments');
//     }
// };

