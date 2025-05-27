<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class FaceRecognitionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('student/face-recognition/index');
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
        $request->validate([
            'descriptor' => 'required|array',
            'position' => 'required|array',
            'position.x' => 'required|numeric',
            'position.y' => 'required|numeric',
            'position.width' => 'required|numeric',
            'position.height' => 'required|numeric',
        ]);

        $student = Auth::user()->student;
        $student->update([
            'face_descriptor' => $request->descriptor
        ]);

        return redirect()->back();
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

    public function compare(Request $request)
    {
        $request->validate([
            'descriptor' => 'required|array',
        ]);

        $student = Auth::user()->student;
        $storedDescriptor = $student->face_descriptor;

        if (!$storedDescriptor) {
            return response()->json([
                'success' => false,
                'message' => 'No face data stored yet'
            ]);
        }

        // Calculate Euclidean distance between descriptors
        $distance = $this->calculateEuclideanDistance($request->descriptor, $storedDescriptor);

        // Lower distance means more similar faces
        // Typically, a threshold of 0.6 is used for face recognition
        $isMatch = $distance < 0.6;

        if ($isMatch) {
            return redirect()->back()->with([
                'toast' => true,
                'type' => 'success',
                'message' => 'Face matched!'
            ]);
        } else {
            return redirect()->back()->with([
                'toast' => true,
                'type' => 'error',
                'message' => 'Face not matched'
            ]);
        }
    }

    private function calculateEuclideanDistance($descriptor1, $descriptor2)
    {
        $sum = 0;
        for ($i = 0; $i < count($descriptor1); $i++) {
            $sum += pow($descriptor1[$i] - $descriptor2[$i], 2);
        }
        return sqrt($sum);
    }
}
