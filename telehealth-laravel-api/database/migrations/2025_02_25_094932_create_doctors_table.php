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
            $table->id(); // Auto-incrementing primary key
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('phone', 12)->unique(); // Ensuring only 12 characters (digits)
            $table->string('specialization');
            $table->integer('experience')->unsigned(); // Experience in years
            $table->integer('slots')->unsigned(); // Available appointment slots
            $table->json('working_days'); // Store days as JSON array
            $table->time('opening_hours'); // Store time in HH:MM:SS format
            $table->time('closing_hours');
            $table->decimal('price', 8, 2); // Store price as decimal (e.g., 100.50)
            $table->text('address');
            $table->string('image'); // Storing image filename/path
            $table->timestamps(); // created_at & updated_at
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
