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
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone')->nullable();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('specialization');
            $table->integer('experience')->nullable();
            $table->json('working_days'); // Stores selected working days (e.g., ["Monday", "Tuesday"])
            $table->json('slots'); // Stores slots per day (e.g., {"Monday": 10, "Tuesday": 10})
            $table->time('opening_hours');
            $table->time('closing_hours');
            $table->decimal('price', 8, 2);
            $table->text('address')->nullable();
            $table->string('image')->nullable(); // Stores image path
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
