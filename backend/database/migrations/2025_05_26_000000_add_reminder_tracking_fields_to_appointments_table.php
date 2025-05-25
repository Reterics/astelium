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
        Schema::table('appointments', function (Blueprint $table) {
            $table->boolean('reminder_48h_sent')->default(false)->after('reminder_sent');
            $table->boolean('reminder_24h_sent')->default(false)->after('reminder_48h_sent');
            $table->boolean('reminder_1h_sent')->default(false)->after('reminder_24h_sent');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn('reminder_48h_sent');
            $table->dropColumn('reminder_24h_sent');
            $table->dropColumn('reminder_1h_sent');
        });
    }
};
