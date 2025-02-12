<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('tax_number')->nullable();
            $table->string('post_code')->nullable();
            $table->string('town')->nullable();
            $table->string('street_name')->nullable();
            $table->string('street_category')->nullable();
            $table->string('address')->nullable();
            $table->string('country')->nullable();
            $table->string('bank_account_number')->nullable();
            $table->enum('type', ['PERSON', 'COMPANY_HU', 'COMPANY_EU', 'COMPANY'])->default('PERSON');
            $table->enum('vat_status', ['PRIVATE_PERSON', 'DOMESTIC', 'OTHER'])->default('PRIVATE_PERSON');

            // New fields
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('company')->nullable();

            $table->timestamps();
        });


        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('status', ['active', 'completed', 'on-hold'])->default('active');
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', ['pending', 'in-progress', 'completed'])->default('pending');
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });


    }

    public function down(): void
    {
        Schema::dropIfExists('clients');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('tasks');
    }
};
