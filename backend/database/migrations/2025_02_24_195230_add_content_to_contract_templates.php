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
        Schema::create('contract_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('path')->nullable()->after('name'); // Stores file path
            $table->text('content')->nullable()->after('path');
            $table->foreignId('account_id')->after('id')->constrained('accounts')->onDelete('cascade');

            $table->timestamps();
        });
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->date('created');
            $table->foreignId('template_id')->constrained('contract_templates')->onDelete('cascade');
            $table->json('data')->nullable();
            $table->foreignId('account_id')->after('id')->constrained('accounts')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contract_templates');
        Schema::dropIfExists('contracts');


    }
};
