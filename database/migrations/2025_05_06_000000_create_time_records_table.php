<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('time_records', function (Blueprint $table) {
      $table->id();
      $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
      $table->dateTime('time_in')->nullable();
      $table->dateTime('time_out')->nullable();
      $table->date('date');
      $table->string('time_in_image')->nullable();
      $table->string('time_out_image')->nullable();
      $table->decimal('required_hours', 5, 2)->default(8.00);
      $table->decimal('completed_hours', 5, 2)->nullable();
      $table->text('remarks')->nullable();
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('time_records');
  }
};
