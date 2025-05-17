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
        Schema::create('maps', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->boolean('private')->default(false);
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('related_project_id')->nullable()->constrained('projects')->onDelete('cascade');
            $table->foreignId('related_task_id')->nullable()->constrained('tasks')->onDelete('cascade');
            $table->foreignId('related_client_id')->nullable()->constrained('clients')->onDelete('cascade');
            $table->foreignId('account_id')->constrained('accounts')->onDelete('cascade');
            $table->timestamps();
        });
        Schema::create('markers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('map_id')->constrained('maps')->onDelete('cascade');
            $table->string('name');
            $table->string('icon_type')->nullable();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->json('gps'); // e.g., { lat: 47.4979, lng: 19.0402 }
            $table->json('tags')->nullable();
            $table->boolean('private')->default(false);
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('account_id')->constrained('accounts')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('markers');
        Schema::dropIfExists('maps');
    }
};
