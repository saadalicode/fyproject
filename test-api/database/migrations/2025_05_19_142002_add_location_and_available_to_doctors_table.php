<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('doctors', function (Blueprint $table) {
        $table->string('location')->nullable();
        $table->boolean('available')->default(true);
    });
}

public function down()
{
    Schema::table('doctors', function (Blueprint $table) {
        $table->dropColumn(['location', 'available']);
    });
}
};
