<?php

namespace App\Http\Controllers;

use App\Models\NotificationTrigger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationTriggerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $triggers = NotificationTrigger::all();

        return Inertia::render('NotificationTriggers/Index', [
            'triggers' => $triggers,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('NotificationTriggers/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:sales_goal,low_stock,birthday',
            'conditions' => 'required|array',
            'title_template' => 'required|string',
            'message_template' => 'required|string',
            'target_type' => 'required|in:user,role,all',
            'target_id' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        NotificationTrigger::create($validated);

        return redirect()->route('notification-triggers.index')->with('success', 'Trigger creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(NotificationTrigger $notificationTrigger)
    {
        return Inertia::render('NotificationTriggers/Show', [
            'trigger' => $notificationTrigger,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(NotificationTrigger $notificationTrigger)
    {
        return Inertia::render('NotificationTriggers/Edit', [
            'trigger' => $notificationTrigger,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, NotificationTrigger $notificationTrigger)
    {
        $validated = $request->validate([
            'type' => 'required|in:sales_goal,low_stock,birthday',
            'conditions' => 'required|array',
            'title_template' => 'required|string',
            'message_template' => 'required|string',
            'target_type' => 'required|in:user,role,all',
            'target_id' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $notificationTrigger->update($validated);

        return redirect()->route('notification-triggers.index')->with('success', 'Trigger actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(NotificationTrigger $notificationTrigger)
    {
        $notificationTrigger->delete();

        return redirect()->route('notification-triggers.index')->with('success', 'Trigger eliminado correctamente.');
    }
    
}
