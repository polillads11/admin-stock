import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {can} from '@/lib/can';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

export default function Index({ roles }: { roles: { id: number; name: string, permissions: { name: string }[] }[] }) {
    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this role?')) {
            router.delete(route('roles.destroy', id));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <div className='p-3'>
                {can('roles.create') && <Link href={route('roles.create')} className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                    Crear
                </Link>}
                <div className="overflow-x-auto mt-3">
                    <table className='w-full text-ms text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Nombre</th>
                            <th scope="col" className="px-6 py-3">Permisos</th>
                            <th scope="col" className="px-6 py-3 w-70">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {roles.map(({id, name, permissions}) => (
                        <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b border-gray-200">
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
                                <Link href={route('roles.show', id)} className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300">
                                    Ver
                                </Link>
                                {can('roles.edit') && <Link href={route('roles.edit', id)} className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300">
                                    Editar
                                </Link>}                  
                                {can('roles.delete') && <button 
                                onClick={() => handleDelete(id)}
                                className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300">
                                    Eliminar
                                </button>}
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
