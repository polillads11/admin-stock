import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles Show',
        href: '/roles',
    },
];

export default function Show({ role, rolePermissions }: { role: { id: number; name: string }; rolePermissions: string[] }) {


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles Show" />
            <div className='p-3'>
                <Link href={route('roles.index')} className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                    Back
                </Link>
                <div><p><strong>Name:</strong> {role.name}</p></div>
                <div><p><strong>Permissions:</strong> </p></div>
                {rolePermissions.map((permission) => (
                    <span key={permission} className='inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1'>{permission}</span>
                ))}
            </div>
        </AppLayout>
    );
}
