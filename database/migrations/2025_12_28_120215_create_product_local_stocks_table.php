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
        Schema::create('product_local_stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('local_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->integer('stock')->default(0);
            $table->timestamps();
            $table->unique(['product_id', 'local_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_local_stocks');
    }
};
