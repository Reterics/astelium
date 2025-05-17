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
        Schema::create('domains', function (Blueprint $table) {
            $table->id();
            $table->string('url')->unique();
            $table->string('description')->nullable();
            $table->string('admin_url')->nullable();
            $table->text('credentials')->nullable();
            $table->foreignId('account_id')->constrained('accounts')->onDelete('cascade');

            $table->timestamps();
        });

        Schema::create('invoice_users', function (Blueprint $table) {
            $table->id();
            $table->string('supplier_name');
            $table->string('supplier_tax_number')->nullable();
            $table->string('supplier_post_code')->nullable();
            $table->string('supplier_town')->nullable();
            $table->string('supplier_street_name')->nullable();
            $table->string('supplier_street_category')->nullable();
            $table->string('supplier_address')->nullable();
            $table->string('supplier_country')->nullable();
            $table->string('supplier_bank_account_number')->nullable();

            // Authentication & Security Fields
            $table->string('login')->nullable();
            $table->string('password')->nullable();
            $table->string('sign_key')->nullable();
            $table->string('exchange_key')->nullable();

            // Tracking Fields
            $table->string('created_by')->nullable();
            $table->string('modified_by')->nullable();
            $table->foreignId('account_id')->constrained('accounts')->onDelete('cascade');

            $table->timestamps(); // Includes created_at & updated_at
        });
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supplier_id')->constrained('invoice_users')->onDelete('cascade');
            $table->foreignId('customer_id')->constrained('clients')->onDelete('cascade');
            $table->string('invoice_number')->unique();
            $table->enum('invoice_category', ['SIMPLIFIED', 'NORMAL', 'AGGREGATE']);
            $table->date('invoice_issue_date');
            $table->date('invoice_delivery_date')->nullable();
            $table->date('invoice_payment_date')->nullable();
            $table->string('invoice_currency')->default('HUF');
            $table->decimal('invoice_exchange_rate', 10, 4)->default(1);
            $table->enum('invoice_payment_method', ['CASH', 'TRANSFER', 'CARD', 'VOUCHER', 'OTHER']);
            $table->enum('invoice_appearance', ['ELECTRONIC', 'PAPER', 'EDI', 'UNKNOWN']);
            $table->decimal('invoice_gross_amount', 15, 2);
            $table->string('transaction_id')->nullable();
            $table->foreignId('account_id')->constrained('accounts')->onDelete('cascade');

            $table->timestamps();
        });
        Schema::create('invoice_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_id')->constrained('invoices')->onDelete('cascade');
            $table->string('product_code_value');
            $table->enum('product_code_category', ['OWN', 'VTSZ', 'SZJ', 'KN', 'AHK', 'CSK', 'KT', 'EJ', 'TESZOR', 'OTHER']);
            $table->decimal('quantity', 10, 2);
            $table->enum('unit_of_measure', ['PIECE', 'KILOGRAM', 'TON', 'KWH', 'DAY', 'HOUR', 'MINUTE', 'MONTH', 'LITER', 'KILOMETER', 'CUBIC_METER', 'METER', 'LINEAR_METER', 'CARTON', 'PACK', 'OWN']);
            $table->decimal('unit_price', 15, 2);
            $table->decimal('line_net_amount', 15, 2);
            $table->decimal('line_vat_rate', 5, 2);
            $table->decimal('line_vat_amount', 15, 2);
            $table->decimal('line_gross_amount', 15, 2);
            $table->string('line_description')->nullable();
            $table->foreignId('account_id')->constrained('accounts')->onDelete('cascade');

            $table->timestamps();
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('domains');
        Schema::dropIfExists('warehouses');
        Schema::dropIfExists('invoice_users');
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('invoice_items');
    }
};
