<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\CompanySubmission;
use App\Models\Journal;
use Illuminate\Http\RedirectResponse;
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
        $submission = CompanySubmission::where('student_id', Auth::id())
            ->where('status', 'approved')
            ->first();
        if (!$submission) {
            return $this->redirectWithError('student.company.index', 'You have not been approved by the company yet.');
        }
        $journals = Journal::where('student_id', Auth::id())->paginate(10);
        return Inertia::render('student/journal/index', [
            'journals' => $journals,
            'submission' => $submission
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

    private function redirectWithError(?string $route, string $message): RedirectResponse
    {
        $response = to_route($route)->with([
            'toast' => true,
            'type' => 'error',
            'message' => $message
        ]);

        return $route ? $response->withErrors(['error' => $message]) : $response;
    }
}
