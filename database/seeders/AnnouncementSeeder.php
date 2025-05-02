<?php

namespace Database\Seeders;

use App\Models\Announcements;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Announcements::create([
            'title' => 'Orientation Reminder',
            'body' => 'All students must attend the OJT orientation on Monday at 9AM.',
            'type' => 'announcement',
            'coordinator_id' => 7, // make sure this ID exists
            'department_id' => 1,  // must match an actual department
            'program_id' => 1,     // must match an actual program
        ]);
    }
}
