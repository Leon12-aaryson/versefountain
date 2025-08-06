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
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('poem_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['like', 'rating']);
            $table->integer('rating')->nullable(); // 1-5 for rating type
            $table->timestamps();
            
            // Ensure a user can only have one interaction of each type per poem
            $table->unique(['user_id', 'poem_id', 'type']);
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
