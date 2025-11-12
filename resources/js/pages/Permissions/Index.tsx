import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import Buscar from "@/components/Buscar";
import Paginacion from "@/components/Paginacion";
import { can } from '@/lib/can'

type PermissionUser = {
  id: number;
  name: string;
  roles: string[];
  direct_permissions: string[];
  role_permissions: string[];
};

interface Pagination {
  data: PermissionUser[];
  links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface IndexProps {
  users: Pagination;
  filters: { search?: string };
}

export default function Index({ users, filters }: IndexProps) {
  // 🔍 Manejar búsqueda
  function handleSearch(search: string) {
    router.get(route("permissions.index"), { search }, { preserveState: true });
  }

  return (
    <AppLayout>
      <Head title="Lista de Permisos" />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Lista de Usuarios y Permisos</h1>

        {/* 🧩 Componente Buscar */}
        <Buscar
          initialValue={filters.search}
          onSearch={handleSearch}
          placeholder="Buscar por nombre o permiso..."
        />

        {/* Tabla */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Usuario</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Roles</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Permisos</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {users.data.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm text-gray-600">{user.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{user.name}</td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {user.roles.length > 0 ? (
                        user.roles.map((role) => (
                          <span key={role} className="px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
                            {role}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 italic text-sm">Sin roles</span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {user.direct_permissions.map((perm) => (
                        <span key={`direct-${perm}`} className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {perm}
                        </span>
                      ))}

                      {user.role_permissions.map((perm) => (
                        <span key={`role-${perm}`} className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          {perm}
                        </span>
                      ))}

                      {user.direct_permissions.length === 0 && user.role_permissions.length === 0 && (
                        <span className="text-gray-400 italic text-sm">Sin permisos</span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Link
                        href={route("permissions.show", user.id)}
                        className="px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
                      >
                        Ver
                      </Link>
                      {can('permissions.assign') && (<Link
                        href={route("permissions.edit", user.id)}
                        className="px-3 py-1 text-xs font-semibold text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                      >
                        Editar
                      </Link>)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🧩 Componente Paginacion */}
        <Paginacion links={users.links} />
      </div>
    </AppLayout>
  );
}
