import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, usePage, router, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from '@/types';

export default function Create() {
  const { flash } = usePage().props as any;

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Caja', href: '/cash-movements' },
    {
      title: 'Nuevo movimiento',
      href: ""
    },
  ];

  const [type, setType] = useState('ingreso');
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [description, setDescription] = useState('');

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.post(route('cash-movements.store'), { type, amount, source, description });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nuevo movimiento" />

      {flash?.success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          {flash.success}
        </div>
      )}
      
      <form onSubmit={submit} className="m-6 max-w-md mx-auto p-4 bg-white shadow">
        <Link href={route('cash-movements.index')} className="text-gray-700">
        &larr; Volver
      </Link>
        <div className="mb-4">
          <label className="block mb-1">Tipo</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="ingreso">Ingreso</option>
            <option value="egreso">Egreso</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Monto</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Origen</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Guardar
        </button>
      </form>
    </AppLayout>
  );
}
