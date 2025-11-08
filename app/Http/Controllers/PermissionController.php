<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with(['roles', 'permissions'])->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'roles' => $user->roles->pluck('name'),
                'direct_permissions' => $user->permissions->pluck('name'),
                'role_permissions' => $user->getPermissionsViaRoles()->pluck('name'),
            ];
        });

        return Inertia::render('Permissions/Index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::with(['roles', 'permissions'])->findOrFail($id);
        return Inertia::render('Permissions/Show', [
            'user' => $user,
            'directPermissions' => $user->permissions->pluck('name'),
            'rolePermissions' => $user->getPermissionsViaRoles()->pluck('name'),
            'permissions' => Permission::pluck('name'),
            'roles' => $user->roles->pluck('name'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = User::with(['roles', 'permissions'])->findOrFail($id);

        return Inertia::render('Permissions/Edit', [
            'user' => $user,
            'usersPermissions' => $user->permissions->pluck('name'),
            'rolePermissions' => $user->getPermissionsViaRoles()->pluck('name'),
            'permissions' => Permission::pluck('name'),
            'roles' => $user->roles->pluck('name'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'required|array',
        ]);

        $user = User::find($id);
        if (! $user) {
            abort(404, 'User not found');
        }

        $user->update([
            'name' => $request->name,
        ]);

        $user->syncPermissions($request->permissions);

        return to_route('permissions.index')
            ->with('success', 'Permissions updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
