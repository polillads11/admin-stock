import React, { useState, useEffect } from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import { route } from 'ziggy-js';
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from '@/types';
import BarcodeScannerModal from "../../components/BarcodeScannerModal";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products Create',
        href: '/products',
    },
];

interface Category {
  id: number;
  name: string;
}

interface Local {
  id: number;
  name: string;
}

interface Props {
  categories: Category[];
  locals: Local[];
}

export default function Create({ categories, locals }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    sku: "",
    name: "",
    description: "",
    category_id: "",
    price: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("products.store"));
  };

  const { flash } = usePage().props as any;
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (flash?.success) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [flash?.success]);

  const [scannerOpen, setScannerOpen] = useState(false);

  const handleBarcodeDetected = (code: string) => {
    setData("sku", code);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
    <div className="p-6 max-w-2xl mx-auto">
      <Head title="Crear Producto" />
      
      {showSuccess && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {flash.success}
          </div>
        )}
        
      <h1 className="text-2xl font-bold mb-4">Nuevo Producto</h1>

      <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block font-semibold">SKU</label>

            <div className="flex gap-2">
              <input
                className="border rounded w-full p-2"
                value={data.sku}
                onChange={(e) => setData("sku", e.target.value)}
              />

              <button
                type="button"
                onClick={() => setScannerOpen(true)}
                className="bg-gray-800 text-white px-3 rounded"
              >
                📷
              </button>
            </div>

            {errors.sku && <p className="text-red-500">{errors.sku}</p>}
          </div>

        <div>
          <label className="block font-semibold">Nombre</label>
          <input
            className="border rounded w-full p-2"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label className="block font-semibold">Descripción</label>
          <textarea
            className="border rounded w-full p-2"
            value={data.description}
            onChange={(e) => setData("description", e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold">Categoría</label>
          <select
            className="border rounded w-full p-2"
            value={data.category_id}
            onChange={(e) => setData("category_id", e.target.value)}
          >
            <option value="">Seleccionar</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Precio</label>
            <input
              type="number"
              className="border rounded w-full p-2"
              value={data.price}
              onChange={(e) => setData("price", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Link href={route("products.index")} className="text-gray-700">
            ← Volver
          </Link>
          <button
            disabled={processing}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
      <BarcodeScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onDetected={handleBarcodeDetected}
      />
    </AppLayout>
  );
}
