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
        Schema::create('user_poems', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('poem_id')->constrained('poems')->onDelete('cascade');
            $table->integer('rating')->nullable(); // e.g., 1-5
            $table->boolean('liked')->default(false);
            $table->unique(['user_id', 'poem_id']); // Ensures one entry per user-poem
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_poems');
    }
};
