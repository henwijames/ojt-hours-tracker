<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Coordinator;
use App\Models\Department;
use App\Models\Student;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        $departments = Department::with('programs')->get();
        // dd($departments);
        return Inertia::render('auth/register', [
            'departments' => $departments,
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'role' => 'required|in:student,coordinator',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'student_id' => [
                Rule::requiredIf(fn() => $request->role === 'student'),
                'nullable',
                'string',
                'max:50',
                'unique:students,student_id',
            ],
            'department_id' => [
                Rule::requiredIf(fn() => $request->role === 'student'),
                'nullable',
                'exists:departments,id',
            ],
            'program_id' => [
                Rule::requiredIf(fn() => $request->role === 'student'),
                'nullable',
                'exists:programs,id',
            ],
        ]);

        // dd($request->all());

        // Create a new user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'password' => Hash::make($request->password),
        ]);
        if ($request->role === 'student') {
            // Create the student and associate the department and program
            Student::create([
                'user_id' => $user->id,
                'student_id' => $request->student_id,
                'program_id' => $request->program_id,  // Storing the program_id
                'department_id' => $request->department_id,  // Storing the department_id
            ]);

            // Redirect with a success message
            return redirect()->route('login')->with('message', 'Your registration is pending approval by the coordinator.');
        } elseif ($request->role === 'coordinator') {
            Coordinator::create([
                'user_id' => $user->id,
            ]);

            return redirect()->route('login')->with('message', 'Your registration is pending approval by the coordinator.');
        }
    }
}
