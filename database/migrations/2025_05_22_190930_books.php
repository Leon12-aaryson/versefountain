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
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('coverImage')->nullable();
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->string('genre')->nullable();
            $table->foreignId('uploadedById')->nullable()->constrained('users')->onDelete('set null');
            $table->boolean('approved')->default(false);
            $table->timestamps(); // Adds created_at and updated_at
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
