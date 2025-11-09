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
            <Head title="User Show" />
            <div className='p-3'>
                <div><p><strong>Name:</strong> {user.name}</p></div>
                <div><p><strong>Email:</strong> {user.email}</p></div>
            </div>
        </AppLayout>
    );
}
