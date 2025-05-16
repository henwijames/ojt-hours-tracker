<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Foundation\Http\FormRequest;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'pending' => session('pending'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        session()->regenerate();

        $user = Auth::user();
        if ($user->role === 'student' && $user->student && $user->student->status === 'pending') {
            Auth::logout();
            session()->invalidate();
            session()->regenerateToken();

            return redirect()->route('login')->with([
                'toast' => true,
                'type' => 'error',
                'message' => 'Your account is pending approval. Please contact the administrator.',
            ]);
        }

        if ($user->role === 'coordinator' && $user->coordinator && $user->coordinator->status === 'pending') {
            Auth::logout();
            session()->invalidate();
            session()->regenerateToken();

            return redirect()->route('login')->with([
                'toast' => true,
                'type' => 'error',
                'message' => 'Your account is pending approval. Please contact the administrator.',
            ]);
        }

        if ($user->role === 'student' && $user->student && $user->student->status === 'inactive') {
            Auth::logout();
            session()->invalidate();
            session()->regenerateToken();

            return redirect()->route('login')->with([
                'toast' => true,
                'type' => 'error',
                'message' => 'Your account is inactive. Please contact the administrator.',
            ]);
        }
        if ($user->role === 'coordinator' && $user->coordinator && $user->coordinator->status === 'inactive') {
            Auth::logout();
            session()->invalidate();
            session()->regenerateToken();

            return redirect()->route('login')->with([
                'toast' => true,
                'type' => 'error',
                'message' => 'Your account is inactive. Please contact the administrator.',
            ]);
        }

        // Ensure session is saved before redirecting
        session()->save();

        return redirect()->intended($user->redirectToDashboard());
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('login');
    }
}
