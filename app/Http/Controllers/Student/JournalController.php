<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Journal;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JournalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $journals = Journal::where('student_id', Auth::user()->id)->get();
        return Inertia::render('student/journal/index', [
            'journals' => $journals
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
        $user = Auth::user();
        $today = now()->toDateString();

        $journalExist = Journal::where('student_id', $user->id)
            ->whereDate('date', $today)
            ->exists();

        if ($journalExist) {
            return redirect()->back()->with([
                'toast' => true,
                'type' => 'error',
                'message' => 'Journal entry already exists for today.'
            ]);
        }

        $validate = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:255',
        ]);

        $journal = Journal::create([
            'student_id' => $user->id,
            'title' => $validate['title'],
            'description' => $validate['description'],
            'date' => $today
        ]);

        if ($journal) {
            return redirect()->back()->with([
                'toast' => true,
                'type' => 'success',
                'message' => 'Journal entry created successfully.'
            ]);
        } else {
            return redirect()->back()->with([
                'toast' => true,
                'type' => 'error',
                'message' => 'Journal entry creation failed.'
            ]);
        }
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
        $journal = Journal::findOrFail($id);
        return Inertia::render('student/journal/edit', [
            'journal' => $journal
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $journal = Journal::findOrFail($id);
        $journal->update($request->all());

        return redirect()->route('student.journals.index')->with([
            'toast' => true,
            'type' => 'success',
            'message' => 'Journal entry updated successfully.'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $journal = Journal::find($id);
        $journal->delete();

        return redirect()->back()->with([
            'toast' => true,
            'type' => 'success',
            'message' => 'Journal entry deleted successfully.'
        ]);
    }
}
