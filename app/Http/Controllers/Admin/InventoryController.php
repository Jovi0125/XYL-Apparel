<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\InventoryService;
use Inertia\Inertia;

class InventoryController extends Controller
{
    protected $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function index()
    {
        return Inertia::render('Admin/Inventory/Index', [
            'overview' => $this->inventoryService->getInventoryOverview(),
            'lowStockProducts' => $this->inventoryService->getLowStockProducts(),
        ]);
    }
}
