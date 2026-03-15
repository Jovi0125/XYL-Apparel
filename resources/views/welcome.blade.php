<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>XYLO APPAREL — Modern Fashion Marketplace</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:300,400,500,600,700" rel="stylesheet" />
    @viteReactRefresh
    @vite(['resources/sass/app.scss', 'resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body class="bg-white text-gray-900 font-sans antialiased min-h-screen">
    <script>
        window.__INITIAL_DATA__ = {
            auth: @json(auth()->check()),
            user: @json(auth()->user()),
            csrfToken: "{{ csrf_token() }}"
        };
    </script>
    <div id="app"></div>
</body>
</html>
