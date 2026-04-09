import React, { useEffect, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

interface Props {
  users: Array<{ id: number; name: string }>;
  roles: string[];
}

export default function Create({ users, roles }: Props) {
  const { data, setData, post, errors } = useForm({
    target_type: 'all',
    target_user_id: '',
    target_role: '',
    title: '',
    message: '',
    type: 'info',
    action_url: '',
    action_text: '',
  });

  const { flash } = usePage().props as any;
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (flash?.success) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [flash?.success]);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Notificaciones',
      href: '/notifications',
    },
    {
      title: 'Crear notificación',
      href: '/notifications/create',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('notifications.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Crear Notificación" />
      <div className="p-6 max-w-3xl mx-auto">
        {showSuccess && (
          <div className="mb-4 rounded-lg bg-green-100 p-4 text-green-800">
            {flash.success}
          </div>
        )}

        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold">Crear notificación</h1>
            <p className="text-sm text-muted-foreground">
              Envía un mensaje directo a un vendedor, a un rol completo o a todos los usuarios.
            </p>
          </div>
          <Link
            href={route('notifications.index')}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Volver
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border p-6 bg-white shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Tipo de destinatario</label>
              <select
                value={data.target_type}
                onChange={(e) => setData('target_type', e.target.value)}
                className="w-full rounded-md border p-2"
              >
                <option value="all">Todos</option>
                <option value="role">Rol</option>
                <option value="user">Vendedor específico</option>
              </select>
              {errors.target_type && <p className="mt-1 text-sm text-red-600">{errors.target_type}</p>}
            </div>

            {data.target_type === 'user' && (
              <div>
                <label className="mb-2 block text-sm font-medium">Seleccionar vendedor</label>
                <select
                  value={data.target_user_id}
                  onChange={(e) => setData('target_user_id', e.target.value)}
                  className="w-full rounded-md border p-2"
                >
                  <option value="">Selecciona un vendedor</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                {errors.target_user_id && <p className="mt-1 text-sm text-red-600">{errors.target_user_id}</p>}
              </div>
            )}

            {data.target_type === 'role' && (
              <div>
                <label className="mb-2 block text-sm font-medium">Seleccionar rol</label>
                <select
                  value={data.target_role}
                  onChange={(e) => setData('target_role', e.target.value)}
                  className="w-full rounded-md border p-2"
                >
                  <option value="">Selecciona un rol</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {errors.target_role && <p className="mt-1 text-sm text-red-600">{errors.target_role}</p>}
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Título</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
              className="w-full rounded-md border p-2"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Mensaje</label>
            <textarea
              value={data.message}
              onChange={(e) => setData('message', e.target.value)}
              className="w-full min-h-[120px] rounded-md border p-2"
            />
            {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Tipo de notificación</label>
              <select
                value={data.type}
                onChange={(e) => setData('type', e.target.value)}
                className="w-full rounded-md border p-2"
              >
                <option value="info">Info</option>
                <option value="success">Éxito</option>
                <option value="warning">Advertencia</option>
                <option value="error">Error</option>
              </select>
              {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Enlace opcional</label>
              <input
                type="url"
                value={data.action_url}
                onChange={(e) => setData('action_url', e.target.value)}
                className="w-full rounded-md border p-2"
                placeholder="https://..."
              />
              {errors.action_url && <p className="mt-1 text-sm text-red-600">{errors.action_url}</p>}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Texto del enlace</label>
            <input
              type="text"
              value={data.action_text}
              onChange={(e) => setData('action_text', e.target.value)}
              className="w-full rounded-md border p-2"
              placeholder="Ver detalle"
            />
            {errors.action_text && <p className="mt-1 text-sm text-red-600">{errors.action_text}</p>}
          </div>

          <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold">Plantillas de ejemplo</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Vendedor con objetivo cumplido:</strong> título "Felicitaciones" y mensaje "Has alcanzado tus objetivos del mes. ¡Sigue así!".
              </li>
              <li>
                <strong>Producto agotado:</strong> título "Stock crítico" y mensaje "El stock del producto X está por agotarse. Por favor revisa con el proveedor.".
              </li>
              <li>
                <strong>Permiso interno:</strong> título "Atención" y mensaje "Recuerda actualizar el inventario diariamente.".
              </li>
            </ul>
          </div>

          <div className="flex justify-end gap-3">
            <Link
              href={route('notifications.index')}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Enviar notificación
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
