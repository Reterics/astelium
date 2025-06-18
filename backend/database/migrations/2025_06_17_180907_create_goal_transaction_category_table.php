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
        Schema::create('goal_transaction_category', function (Blueprint $table) {
            $table->foreignId('goal_id')->constrained('goals')->onDelete('cascade');
            $table->foreignId('transaction_category_id')->constrained('transaction_categories')->onDelete('cascade');
            $table->primary(['goal_id', 'transaction_category_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('goal_transaction_category');
    }
};
