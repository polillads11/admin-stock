import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ver Rol',
        href: '/roles',
    },
];

export default function Show({ role, rolePermissions }: { role: { id: number; name: string }; rolePermissions: string[] }) {


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ver Rol" />
            <div className='p-3'>
                <div><p><strong>Nombre:</strong> {role.name}</p></div>
                <div><p><strong>Permisos:</strong> </p></div>
                {rolePermissions.map((permission) => (
                    <span key={permission} className='inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1'>{permission}</span>
                ))}
            </div>
        </AppLayout>
    );
}
