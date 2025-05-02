<?php

namespace App\Http\Controllers\Coordinator;

use App\Http\Controllers\Controller;
use App\Models\Announcements;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $announcements = Auth::user()->coordinator->announcements()->with(['department', 'program'])->latest()->paginate(10);
        return Inertia::render('coordinator/announcements/index', [
            'announcements' => $announcements,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validate = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'type' => 'required|in:announcement,reminder',
        ]);

        $validate['coordinator_id'] = Auth::user()->coordinator->id;

        $validate['department_id'] = Auth::user()->coordinator->department_id;

        $validate['program_id'] = Auth::user()->coordinator->program_id;


        // dd($validate);
        Announcements::create($validate);
        return redirect()->back()->with([
            'toast' => true,
            'type' => 'success',
            'message' => 'Announcement created successfully.',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
