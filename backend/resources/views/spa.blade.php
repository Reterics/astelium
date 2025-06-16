<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Astelium SPA</title>
    <script>window.APP_URL = "{{ config('app.url') }}";</script>
    @viteReactRefresh
    @vite('src/main.tsx')
</head>
<body>
    <div id="app"></div>
</body>
</html>
