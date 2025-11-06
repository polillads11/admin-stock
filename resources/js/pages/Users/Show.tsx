import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Show',
        href: '/users',
    },
];

export default function Show({ user }: { user: { id: number; name: string; email: string }  }) {


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Show" />
            <div className='p-3'>
                <Link href={route('users.index')} className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                    Back
                </Link>
                <div><p><strong>Name:</strong> {user.name}</p></div>
                <div><p><strong>Email:</strong> {user.email}</p></div>
            </div>
        </AppLayout>
    );
}
