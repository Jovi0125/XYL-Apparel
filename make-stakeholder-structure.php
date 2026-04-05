<?php

/**
 * XYLO APPAREL - Stakeholder Directory Automator
 * Run: php make-stakeholder-structure.php
 */

$paths = [
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
];

echo "🚀 Initializing XYLO Stakeholder Structure...\n";

foreach ($paths as $path) {
    if (!is_dir(__DIR__ . '/' . $path)) {
        if (mkdir(__DIR__ . '/' . $path, 0755, true)) {
            echo "✅ Created: $path\n";
        } else {
            echo "❌ Failed: $path\n";
        }
    } else {
        echo "⏭️ Exists: $path\n";
    }
}

echo "\n✨ Structure complete. Ready for development.\n";
