<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
         Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();

            $table->foreignId('product_local_stock_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->integer('quantity'); // + entra | - sale

            $table->enum('type', [
                'purchase',
                'sale',
                'adjust',
                'transfer_in',
                'transfer_out'
            ]);

            $table->string('reference_type')->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();

            $table->text('note')->nullable();

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamps();
        });

    }

    public function down(): void {
        Schema::dropIfExists('stock_movements');
    }
};
