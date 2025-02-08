<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('storages', function (Blueprint $table) {
            $table->id();
            $table->string('sku')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('threshold');
            $table->integer('storage_amount');
            $table->decimal('value', 10, 2);
            $table->string('place');
            $table->timestamps();
        });

        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['income', 'outgoing']);
            $table->decimal('amount', 10, 2);
            $table->date('date');
            $table->text('description')->nullable();
            $table->foreignId('related_project_id')->nullable()->constrained('projects')->onDelete('cascade');
            $table->foreignId('related_client_id')->nullable()->constrained('clients')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->foreignId('related_project_id')->nullable()->constrained('projects')->onDelete('cascade');
            $table->foreignId('related_task_id')->nullable()->constrained('tasks')->onDelete('cascade');
            $table->foreignId('related_client_id')->nullable()->constrained('clients')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('storages');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('notes');
    }
};
