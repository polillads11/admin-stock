import AppLayout from '@/layouts/app-layout';
import roles from '@/routes/roles';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Create',
        href: '/users',
    },
];

export default function Create({ roles }: { roles: string[] }) {

    const { data, setData, post,  errors } = useForm<{
        name: string;
        email: string;
        password: string;
        roles: string[];
    }>({
        name: '',
        email: '',
        password: '',
        roles: []
    });

    function handleCheckboxChange(roleName: string, Checked: boolean) {
        if (Checked) {
            setData('roles', [...data.roles, roleName]);
        } else {
            setData('roles', data.roles.filter(name => name !== roleName));
        }
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('users.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Create" />
            <div className='p-3'>
                <Link href={route('users.index')} className="cursor-pointer px-3 py-2 text-xs font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                    Back
                </Link>
                <form onSubmit={submit} className='space-y-6 mt-4 max-w-md mx-auto'>
                    <div className='grid gap-2'>
                        <label htmlFor="name" className='text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50'>Name</label>
                        <input type="text"
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            name="name"
                            className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            placeholder='Enter your name'/>
                        {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name}</p>}
                    </div>
                    <div className='grid gap-2'>
                        <label htmlFor="email" className='text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50'>Email</label>
                        <input type="email" id="email" value={data.email} onChange={(e) => setData('email', e.target.value)} name="email" className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500' placeholder='Enter your Email' />
                        {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email}</p>}
                    </div>
                    <div className='grid gap-2'>
                        <label htmlFor="password" className='text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50'>Password</label>
                        <input type="password" id="password" value={data.password} onChange={(e) => setData('password', e.target.value)} name="password" className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500' placeholder='Enter your Password' />
                        {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password}</p>}
                    </div>
                    <div className='grid gap-2'>
                        <label htmlFor="roles"
                            className='text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50'>
                            Roles:
                        </label>
                        {roles.map((role) => (
                            <label key={role} className='flex items-center space-x-2'>
                                <input type="checkbox"
                                    value={role}
                                    id={role}
                                    onChange={(e) => handleCheckboxChange(role, e.target.checked)}
                                    className='form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out'
                                />
                                <span className='text-gray-600 capitalize'>{role}</span>
                            </label>
                        ))}
                        {errors.roles && <p className='text-red-500 text-sm mt-1'>{errors.roles}</p>}
                    </div>
                    <button type="submit" className='inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-700 border border-transparent rounded-md shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
                        Create
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
