import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { permission } from 'process';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Editar Rol',
        href: '/roles',
    },
];

type EditProps = {
    role: {
        id: number | string;
        name: string;
    };
    rolePermissions: string[];
    permissions: string[];
};

export default function Edit({ role, rolePermissions, permissions }: EditProps) {

    const { data, setData, put,  errors } = useForm({
        name: role.name || '',
        permissions: rolePermissions || []
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(route('roles.update', role.id));
    }

    function handleCheckboxChange(permissionName: string, Checked: boolean) {
        if (Checked) {
            setData('permissions', [...data.permissions, permissionName]);
        } else {
            setData('permissions', data.permissions.filter(name => name !== permissionName));
        }
    }

    // Dividir permisos en columnas de 10 elementos
    const chunkSize = 10;
    const permissionColumns: string[][] = [];
    for (let i = 0; i < permissions.length; i += chunkSize) {
        permissionColumns.push(permissions.slice(i, i + chunkSize));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Rol" />
            <div className='p-3'>
                <form onSubmit={submit} className='space-y-6 mt-4 max-w-md mx-auto'>
                    <div className='grid gap-2'>
                        <label htmlFor="name" className='text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50'>Nombre</label>
                        <input type="text"
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            name="name"
                            className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            placeholder='Enter Name'/>
                        {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name}</p>}
                    </div>
                    <div className='grid gap-2'>
                        <label htmlFor="permissions"
                            className='text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50'>
                            Permisos:
                        </label>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 p-4 border rounded-md bg-gray-50">
                            {permissionColumns.map((col, colIndex) => (
                                <div key={colIndex} className="flex flex-col gap-2">
                                    {col.map((perm) => {
                                        const isInherited = rolePermissions.includes(perm);
                                        const isChecked = data.permissions.includes(perm) || isInherited;

                                        return (
                                            <label key={perm} className='flex items-center space-x-2'>
                                                <input type="checkbox"
                                                    value={perm}
                                                    id={perm}
                                                    checked={data.permissions.includes(perm)}
                                                    onChange={(e) => handleCheckboxChange(perm, e.target.checked)}
                                                    className='form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out'
                                                />
                                                <span className='text-gray-600 capitalize'>{perm}</span>
                                            </label>
                                        );
                                    })}
                                    {errors.permissions && <p className='text-red-500 text-sm mt-1'>{errors.permissions}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex justify-between">
                        <Link href={route("roles.index")} className="text-gray-700">
                            ← Volver
                        </Link>

                        <button type="submit" className='inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-700 border border-transparent rounded-md shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
                            Editar
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
