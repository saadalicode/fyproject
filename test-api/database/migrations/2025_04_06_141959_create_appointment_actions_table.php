<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('appointment_actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appointment_id')->constrained()->onDelete('cascade');
            $table->enum('action_type', ['rescheduled', 'cancelled']);
            $table->timestamp('action_at')->useCurrent();
            $table->text('remarks')->nullable();
            
            $table->unsignedBigInteger('performed_by')->nullable(); // ID of patient/doctor/admin
            // $table->enum('performed_by_role', ['patient', 'doctor', 'admin'])->nullable();
            $table->enum('performed_by_role', ['admin', 'doctor', 'patient'])->default('patient'); // only for now, bcz I consider patient how is performing appointment actions
        
            $table->timestamps();
        
            // Optional FK (only if all users are stored in one table like "users")
            // Otherwise you can skip FK constraint to support multi-model users
            $table->foreign('performed_by')->references('id')->on('users')->onDelete('set null');
        }); 
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointment_actions');
    }
};
