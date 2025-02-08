<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Inertia React App</title>
    @viteReactRefresh
    @vite('src/main.tsx')
</head>
<body>
@inertia

<!-- Debug output -->
<pre>
APP_ENV: {{ config('app.env') }}
VITE_DEV_SERVER_URL: {{ config('vite.dev_server_url') ?? env('VITE_DEV_SERVER_URL') }}
  </pre>
</body>
</html>
