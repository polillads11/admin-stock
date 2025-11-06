import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { can } from '@/lib/can';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    roles: Array<{ name: string }>;
}

interface Pagination {
    data: User[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

export default function Index({ users, filters }: { users: Pagination; filters: { search?: string } }) {
    const [search, setSearch] = useState(filters.search || '');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get(route('users.index'), { search }, { preserveState: true });
    }
    
    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('users.destroy', id));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className='p-3'>
                {can('user.create') && <Link href={route('users.create')}className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                                    Create
                                </Link>}
                {/* Buscador */}
                    <form onSubmit={handleSearch} className="flex items-center mt-3">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="ml-2 px-3 py-1 text-sm text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                        >
                            Search
                        </button>
                    </form>
                <div className="overflow-x-auto mt-3">
                    <table className='w-full text-ms text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Roles</th>
                            <th scope="col" className="px-6 py-3 w-70">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.data.map(({id, name, email, roles}) => 
                        <tr key={id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b border-gray-200">
                            <td className="px-6 py-2 font-medium text-gray-700">{id}</td>
                            <td className="px-6 py-2 text-gray-700">{name}</td>
                            <td className="px-6 py-2 text-gray-700">{email}</td>
                            <td className="px-6 py-2 space-x-1">
                                {roles.map((role) =>
                                    <span key={role.name} className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                                        {role.name}
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-2 space-x-1">
                                <Link href={route('users.show', id)} className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300">
                                    Show
                                </Link>
                                {can('user.edit') && <Link href={route('users.edit', id)} className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                                    Edit
                                </Link>}                              
                                {can('user.delete') && <button 
                                onClick={() => handleDelete(id)}
                                className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300">
                                    Delete
                                </button>}
                            </td>
                        </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                {/* Paginación */}
                <div className="flex justify-center mt-4 space-x-2">
                    {users.links.map((link, index) => (
                        <button
                            key={index}
                            disabled={!link.url}
                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                            className={`px-3 py-1 text-sm rounded-lg ${
                                link.active
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
