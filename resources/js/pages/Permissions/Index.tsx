/*import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {can} from '@/lib/can';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permissions',
        href: '/permissions',
    },
];

export default function Index({ users }: { users: { id: number; name: string, permissions: { name: string }[] }[] }) {


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />
            <div className='p-3'>
                <div className="overflow-x-auto mt-3">
                    <table className='w-full text-ms text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Usuario</th>
                            <th scope="col" className="px-6 py-3">Permisos</th>
                            <th scope="col" className="px-6 py-3 w-70">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(({id, name, permissions}) => (
                        <tr key={id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b border-gray-200">
                            <td className="px-6 py-2 font-medium text-gray-700">{id}</td>
                            <td className="px-6 py-2 text-gray-700">{name}</td>
                            <td className="px-6 py-2 space-x-1">
                                {permissions.map((permission) =>
                                    <span key={permission.name} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                                        {permission.name}
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-2">
                                <Link href={route('permissions.show', id)} className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300">
                                    Show
                                </Link>
                                <Link href={route('permissions.edit', id)} className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300">
                                    Edit
                                </Link>
                            </td>
                        </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
*/

import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";

type PermissionUser = {
  id: number;
  name: string;
  roles: string[];
  direct_permissions: string[];
  role_permissions: string[];
};

type IndexProps = {
  users: PermissionUser[];
};

export default function Index({ users }: IndexProps) {
  return (
    <AppLayout>
      <Head title="Permissions List" />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Lista de Usuarios y Permisos</h1>

        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Usuario</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Roles</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Permisos</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm text-gray-600">{user.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{user.name}</td>

                  {/* Roles */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {user.roles.length > 0 ? (
                        user.roles.map((role) => (
                          <span
                            key={role}
                            className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full"
                          >
                            {role}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 italic text-sm">Sin roles</span>
                      )}
                    </div>
                  </td>

                  {/* Permisos */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {user.direct_permissions.map((perm) => (
                        <span
                          key={`direct-${perm}`}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                        >
                          {perm}
                        </span>
                      ))}

                      {user.role_permissions.map((perm) => (
                        <span
                          key={`role-${perm}`}
                          title="Permiso heredado por rol"
                          className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                        >
                          {perm}
                        </span>
                      ))}

                      {user.direct_permissions.length === 0 && user.role_permissions.length === 0 && (
                        <span className="text-gray-400 italic text-sm">Sin permisos</span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Link
                        href={route("permissions.show", user.id)}
                        className="inline-flex items-center px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition"
                      >
                        Show
                      </Link>
                      <Link
                        href={route("permissions.edit", user.id)}
                        className="inline-flex items-center px-3 py-1 text-xs font-semibold text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

