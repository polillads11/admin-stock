import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ver Usuario',
        href: '/users',
    },
];

export default function Show({ user }: { user: { id: number; name: string; email: string }  }) {


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mostrar Usuario" />
            <div className='p-6 max-w-2xl mx-auto bg-white rounded-lg shadow'>
            <Link href={route('users.index')} className="text-gray-700">
                ← Volver
            </Link>
            <div className='p-3'>
                <div><p><strong>Name:</strong> {user.name}</p></div>
                <div><p><strong>Email:</strong> {user.email}</p></div>
            </div>
            </div>
        </AppLayout>
    );
}
