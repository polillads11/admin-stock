import { useState, useEffect } from "react";
import { Head, router, Link, usePage} from "@inertiajs/react";
import axios from "axios";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Nueva Venta',
        href: '/sales/create',
    },
];

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface PageProps extends Record<string, any> {
  locals: Local[];
  flash: {
    success?: string;
  };
}

interface Local {
  id: number;
  name: string;
}

interface SaleItem extends Product {
  quantity: number;
  subtotal: number;
}

export default function Create() {
  const { props } = usePage<PageProps>();
  const locals = props.locals || [];
  const flash = props.flash || {};

  const [localId, setLocalId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [items, setItems] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [customer_name, setCustomerName] = useState("");

  // Buscar productos (con debounce)
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.length > 1) {
        if (!localId) {
          alert("⚠️ Debes seleccionar un local antes de buscar productos.");
          setResults([]);
          return;
        }

        axios
          .get(route("api.products.search"), {
            params: { q: search, local_id: localId },
          })
          .then((res) => setResults(res.data))
          .catch(() => setResults([]));
      } else {
        setResults([]);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [search, localId]);


  const addItem = (product: Product) => {
    const exists = items.find((i) => i.id === product.id);
    if (exists) {
      const updated = items.map((i) =>
        i.id === product.id
          ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.price }
          : i
      );
      setItems(updated);
    } else {
      setItems([...items, { ...product, quantity: 1, subtotal: product.price }]);
    }
    setSearch("");
    setResults([]);
  };

  const updateQuantity = (id: number, quantity: number) => {
    const updated = items.map((i) =>
      i.id === id
        ? { ...i, quantity, subtotal: quantity * i.price }
        : i
    );
    setItems(updated);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const total = items.reduce((sum, i) => sum + i.subtotal, 0);

  const handleSubmit = async () => {
    if (!localId) return alert("Selecciona un local.");
    if (items.length === 0) return alert("Agrega al menos un producto.");
    if (items.some(item => item.quantity > item.stock)) return alert("La cantidad supera el stock disponible.");

    setLoading(true);
    try {
      await router.post(route("sales.store"), {
        local_id: localId,
        products: items.map((i) => ({
          id: i.id,
          quantity: i.quantity,
        })),
        customer_name,
        total,
      }, {
        preserveScroll: true,
        onSuccess: () => {
          // recargar props para mostrar el mensaje flash
          //router.reload({ only: ['flash'] });
          // Limpiar formulario después de guardar
          setCustomerName("");
          //setLocalId("");
          setItems([]);
          setSearch("");
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nueva Venta" />

      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Registrar Venta</h1>

        {/* ✅ Mensaje de éxito */}
        {flash.success && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-700 border border-green-300">
            {flash.success}
          </div>
        )}

        {/* Selección de local */}
        <div className="mb-4">
          <label className="font-semibold">Local</label>
          <select
            className="border rounded w-full p-2 mt-1"
            value={localId}
            onChange={(e) => setLocalId(e.target.value)}
          >
            <option value="">Seleccionar local</option>
            {locals.map((local) => (
              <option key={local.id} value={local.id}>
                {local.name}
              </option>
            ))}
          </select>
        </div>

        {/* Cliente */}
        <div>
          <label className="font-semibold">Cliente</label>
          <input
            className="border rounded w-full p-2 mb-3"
            value={customer_name}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        {/* Buscar productos */}
        {/* Buscar productos */}
        <div className="relative mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full border rounded-lg px-3 py-2"
          />
          {results.length > 0 && (
            <ul className="absolute z-10 bg-white dark:bg-gray-800 border rounded-lg mt-1 w-full">
              {results.map((product) => (
                <li
                  key={product.id}
                  onClick={() => addItem(product)}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  {product.name} — ${product.price}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tabla de productos */}
        {items.length > 0 ? (
          <table className="w-full border-collapse mb-6">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="text-left p-2">Producto</th>
                <th className="p-2">Precio</th>
                <th className="p-2">Stock</th>
                <th className="p-2">Cantidad</th>
                <th className="p-2">Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2 text-center">${item.price}</td>
                  <td className="p-2 text-center">{item.stock}</td>
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value) || 1)
                      }
                      className="w-16 text-center border rounded"
                    />
                  </td>
                  <td className="p-2 text-center">${item.subtotal}</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center mb-6">
            No hay productos agregados.
          </p>
        )}

        {/* Total y botón */}
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold">
            Total: ${total}
          </span>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Registrar Venta"}
          </button>
        </div>

        <Link
          href={route("sales.index")}
          className="text-gray-700 underline block mt-4"
        >
          ← Volver
        </Link>
      </div>
    </AppLayout>
  );
}