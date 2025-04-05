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
        Schema::table('tasks', function (Blueprint $table) {
            $table->json('gps')->nullable(); // {lat, lng}
            $table->string('address')->nullable();
        });

        Schema::table('notes', function (Blueprint $table) {
            $table->json('gps')->nullable();
            $table->string('address')->nullable();
        });

        Schema::table('clients', function (Blueprint $table) {
            $table->json('gps')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn(['gps', 'address']);
        });

        Schema::table('notes', function (Blueprint $table) {
            $table->dropColumn(['gps', 'address']);
        });

        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn(['gps']);
        });
    }
};
