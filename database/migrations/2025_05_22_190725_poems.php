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
        Schema::create('poems', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->boolean('isVideo')->default(false);
            $table->string('videoUrl')->nullable();
            $table->boolean('approved')->default(true); // Default to true based on latest doc
            $table->timestamps(); // Adds updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('poems');
    }
};
