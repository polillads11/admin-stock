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
        Schema::create('notification_triggers', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // sales_goal, low_stock, birthday
            $table->json('conditions'); // e.g., {"sales_count": 10, "period": "month"}
            $table->string('title_template');
            $table->text('message_template');
            $table->string('target_type')->default('user'); // user, role, all
            $table->unsignedBigInteger('target_id')->nullable(); // user_id or role_id
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_triggers');
    }
};
