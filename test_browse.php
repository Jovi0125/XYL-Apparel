<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$request = Illuminate\Http\Request::create('/customer/browse', 'GET');
$request->headers->set('Accept', 'application/json');

$response = app()->handle($request);
echo $response->getContent();
