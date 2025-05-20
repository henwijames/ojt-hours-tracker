<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description"
    content="Easily monitor and manage student OJT hours at Lemery Colleges with our user-friendly tracking system. Designed for admins, coordinators, and students to ensure accurate, real-time updates and efficient reporting.">
  <meta name="robots" content="index, follow">
  <meta name="googlebot" content="index, follow">
  <meta property="og:title" content="{{ config('app.name', 'OJT Hours Tracker') }}">
  <meta property="og:description"
    content="Easily monitor and manage student OJT hours at Lemery Colleges with our user-friendly tracking system.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{{ url()->current() }}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{{ config('app.name', 'OJT Hours Tracker') }}">
  <meta name="twitter:description"
    content="Easily monitor and manage student OJT hours at Lemery Colleges with our user-friendly tracking system.">

  {{-- Inline script to detect system dark mode preference and apply it immediately --}}
  <script>
    (function() {
      const appearance = '{{ $appearance ?? 'system' }}';

      if (appearance === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (prefersDark) {
          document.documentElement.classList.add('dark');
        }
      }
    })();
  </script>

  {{-- Inline style to set the HTML background color based on our theme in app.css --}}
  <style>
    html {
      background-color: oklch(1 0 0);
    }

    html.dark {
      background-color: oklch(0.145 0 0);
    }
  </style>

  <title inertia>{{ config('app.name', 'Laravel') }}</title>

  <link rel="preconnect" href="https://fonts.bunny.net">
  <link rel="icon" href="/favicon.ico">
  <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

  @routes
  @viteReactRefresh
  @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
  @inertiaHead
</head>

<body class="font-sans antialiased">
  @inertia
</body>

</html>
