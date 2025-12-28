<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('local_id')
            ->nullable() // 👈 importante para SQLite
            ->constrained()
            ->onDelete('cascade');
            $table->string('customer_name')->nullable();
            $table->decimal('total', 12, 2)->default(0);
            $table->enum('status', ['draft', 'completed', 'cancelled'])->default('completed');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('sales');
    }
};
