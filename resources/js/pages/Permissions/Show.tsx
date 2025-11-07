/*import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permissions Show',
        href: '/permissions',
    },
];

export default function Show({ user, permissions, rolePermissions }: { user: { id: number; name: string }; permissions: string[]; rolePermissions: string[] }) {


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions Show" />
            <div className='p-3'>
                <Link href={route('permissions.index')} className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                    Back
                </Link>
                <div><p><strong>Name:</strong> {user.name}</p></div>
                <div><p><strong>Permissions:</strong> </p></div>
                {permissions.map((permission) => (
                    <span key={permission} className='inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1'>{permission}</span>
                ))}
            </div>
        </AppLayout>
    );
}
*/

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Permissions Show',
    href: '/permissions',
  },
];

export default function Show({
  user,
  permissions,
  rolePermissions,
}: {
  user: { id: number; name: string };
  permissions: string[];
  rolePermissions: string[];
}) {
  // Detectar cuáles permisos son heredados y cuáles directos
  const directPermissions = permissions.filter(
    (perm) => !rolePermissions.includes(perm)
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Permissions Show" />

      <div className="p-4 max-w-2xl mx-auto">
        <Link
          href={route('permissions.index')}
          className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          Volver
        </Link>

        <div className="mt-4 space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-700">
              <strong>Usuario:</strong> {user.name}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Permisos Directos:
            </p>
            {directPermissions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {directPermissions.map((permission) => (
                  <span
                    key={permission}
                    className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No tiene permisos directos asignados.
              </p>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Heredado de Rol:
            </p>
            {rolePermissions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {rolePermissions.map((perm) => (
                  <span
                    key={`role-${perm}`}
                    title="Permiso heredado por rol"
                    className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No tiene permisos heredados.
              </p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
