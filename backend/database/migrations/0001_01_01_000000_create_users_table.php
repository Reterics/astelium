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
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('admin_user_id')->constrained('users')->onDelete('cascade'); // Admin of the account
            $table->string('subscription_plan')->default('free'); // Free, Pro, Enterprise
            $table->string('subscription_status')->default('inactive'); // active, canceled, expired
            $table->string('billing_cycle')->default('monthly'); // monthly, yearly
            $table->timestamp('trial_ends_at')->nullable(); // If using trials
            $table->timestamp('subscription_expires_at')->nullable(); // When the subscription ends
            $table->timestamps();
        });
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('avatar_url')->nullable()->after('email');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('role')->default('member');
            $table->foreignId('account_id')->nullable()->constrained('accounts')->onDelete('cascade');

            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['account_id']);
            $table->dropColumn('account_id');
        });
        Schema::dropIfExists('users');
        Schema::dropIfExists('accounts');

        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
