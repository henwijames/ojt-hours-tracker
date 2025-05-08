<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Announcements;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcements::where('program_id', Auth::user()->student->program_id)
            ->where('type', 'announcement')
            ->with(['department', 'program'])
            ->latest()
            ->paginate(5);

        return Inertia::render('student/announcements', [
            'announcements' => $announcements,
        ]);
    }
}
