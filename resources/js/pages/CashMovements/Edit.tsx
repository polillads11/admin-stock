import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from '@/types';

interface CashMovement {
  id: number;
  type: string;
  amount: number;
  source?: string;
  description?: string;
}

export default function Edit({ cashMovement }: { cashMovement: CashMovement }) {
  const { data, setData, put, errors } = useForm({
    type: cashMovement.type || "",
    amount: cashMovement.amount || 0,
    source: cashMovement.source || "",
    description: cashMovement.description || "",
  });

  const breadcrumbs: BreadcrumbItem[] = [
      {
          title: 'Cash Movements Edit',
          href: '/cash-movements',
      },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route("cash-movements.update", cashMovement.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Movimiento de Caja" />
      <h1 className="text-2xl font-bold mb-4">Editar Movimiento de Caja</h1>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block font-semibold">Tipo</label>
          <input
            type="text"
            value={data.type}
            onChange={(e) => setData("type", e.target.value)}
            className="w-full border rounded p-2"
          />
          {errors.type && <div className="text-red-500 text-sm">{errors.type}</div>}
        </div>
        <div>
          <label className="block font-semibold">Monto</label>
          <input
            type="number"
            value={data.amount}
            onChange={(e) => setData("amount", parseFloat(e.target.value) || 0)}
            className="w-full border rounded p-2"
          />
          {errors.amount && <div className="text-red-500 text-sm">{errors.amount}</div>}
        </div>
        <div>
          <label className="block font-semibold">Origen</label>
          <input
            type="text"
            value={data.source}
            onChange={(e) => setData("source", e.target.value)}
            className="w-full border rounded p-2"
          />
          {errors.source && <div className="text-red-500 text-sm">{errors.source}</div>}
        </div>
        <div>
          <label className="block font-semibold">Descripción</label>
          <input
            type="text"
            value={data.description}
            onChange={(e) => setData("description", e.target.value)}
            className="w-full border rounded p-2"
          />
          {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}
        </div>
        <div className="flex justify-between">
          <Link href={route("cash-movements.index")} className="text-gray-700">
            ← Volver
          </Link>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Actualizar
        </button>
        </div>
      </form>
    </AppLayout>
  );
}
