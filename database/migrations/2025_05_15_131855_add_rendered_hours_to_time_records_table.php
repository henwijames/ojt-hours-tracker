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
        Schema::table('time_records', function (Blueprint $table) {
            $table->decimal('rendered_hours', 10, 2)->after('remarks')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('time_records', function (Blueprint $table) {
            $table->dropColumn('rendered_hours');
        });
    }
};
