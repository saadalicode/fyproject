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
            $table->text('working_days')->nullable(); // JSON-like string
            $table->text('slots')->nullable();
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
