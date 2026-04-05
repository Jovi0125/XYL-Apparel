<?php

// make-stakeholder-structure.php
// Ensure this script is run from the project root.

$dirs = [
    // Controllers
    'app/Http/Controllers/Admin',
    'app/Http/Controllers/Buyer',
    'app/Http/Controllers/Logistics',
    'app/Http/Controllers/Auth',

    // Requests
    'app/Http/Requests/Admin',
    'app/Http/Requests/Buyer',
    'app/Http/Requests/Logistics',

    // Frontend Pages
    'resources/js/Pages/Admin',
    'resources/js/Pages/Buyer',
    'resources/js/Pages/Logistics',

    // Frontend Components
    'resources/js/Components/admin',
    'resources/js/Components/buyer',
    'resources/js/Components/logistics',

    // Layouts
    'resources/js/Layouts',
];

foreach ($dirs as $dir) {
    if (!is_dir($dir)) {
        if (mkdir($dir, 0755, true)) {
            echo "Created: $dir\n";
        } else {
            echo "Failed to create: $dir\n";
        }
    } else {
        echo "Already exists: $dir\n";
    }
}

echo "\nStructure initialization complete.\n";
