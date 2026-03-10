import { useState, useEffect, useRef } from "react";
import { Head, router, Link, usePage } from "@inertiajs/react";
import axios from "axios";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from "@/types";
import BarcodeScannerModal from "../../components/BarcodeScannerModal";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Nueva Venta",
    href: "/sales/create",
  },
];

interface Product {
  selected: boolean;
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface OfferData {
  id: number;
  name: string;
  discount: number;
  products: { id: number; pivot: { quantity: number } }[];
}

interface PageProps extends Record<string, any> {
  locals: Local[];
  flash: {
    success?: string;
  };
  offers?: OfferData[];
}

interface Local {
  id: number;
  name: string;
}

interface SaleItem extends Product {
  quantity: number;
  subtotal: number;
  basePrice: number;
}

export default function Create() {
  const { props } = usePage<PageProps>();
  const locals = props.locals || [];
  const flash = props.flash || {};
  const offers = props.offers || [];

  const [localId, setLocalId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [items, setItems] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(false);
  // ref used to synchronously block repeated submissions (state updates are async)
  const [submittingRef, setSubmittingRef] = useState(false);
  const [customer_name, setCustomerName] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [showScanner, setShowScanner] = useState(false);

  // compute applicable offers from items
  const applicableOffers = offers.filter((off) =>
    off.products.every((p) =>
      items.find((i) => i.id === p.id && i.quantity >= (p.pivot.quantity || 1))
    )
  );

  const handleBarcodeDetected = async (code: string) => {
    if (!localId) {
      alert("Selecciona un local primero.");
      return;
    }

    try {
      const res = await axios.get(route("api.products.byBarcode"), {
        params: {
          barcode: code,
          local_id: localId,
        },
      });

      const product = res.data;

      if (product) {
        addItem(product);
      } else {
        console.log("1: ", code);
        alert("Producto no encontrado");
      }
    } catch (error) {
      console.log("2: ", code);
      alert("Producto no encontrado");
    }
    setShowScanner(false); 
  };

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
    const basePrice = Number(product.price);
    // determine best discount for this product from currently applicable offers
    let best = 0;
    applicableOffers.forEach((off) => {
      if (off.products.some(p => p.id === product.id)) {
        best = Math.max(best, off.discount);
      }
    });
    const price = +(basePrice * (1 - best / 100)).toFixed(2);

    setItems((prevItems) => {
      const exists = prevItems.find((i) => i.id === product.id);

      if (exists) {
        return prevItems.map((i) =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + 1, subtotal: +( (i.quantity + 1) * price ).toFixed(2) }
            : i
        );
      } else {
        return [...prevItems, { ...product, quantity: 1, subtotal: price, price, basePrice } as SaleItem];
      }
    });
  };


  const updateQuantity = (id: number, quantity: number) => {
    const updated = items.map((i) =>
      i.id === id ? { ...i, quantity, subtotal: +(quantity * Number(i.price)).toFixed(2) } : i
    );
    setItems(updated);
  };

  // recalc prices/subtotals when applicable offers or items list change
  useEffect(() => {
    if (items.length === 0) return;
    // determine applicable offers again (might have changed due to items change)
    const applicable = offers.filter((off) =>
      off.products.every((p) =>
        items.find((i) => i.id === p.id && i.quantity >= (p.pivot.quantity || 1))
      )
    );

    const updated = items.map((i) => {
      const best = applicable.reduce((b, off) => {
        if (off.products.some((p) => p.id === i.id)) {
          return Math.max(b, off.discount);
        }
        return b;
      }, 0);
      const price = +(i.basePrice * (1 - best / 100)).toFixed(2);
      return { ...i, price, subtotal: +(price * i.quantity).toFixed(2) };
    });

    // only update if something changed
    const unchanged = updated.every((u, idx) =>
      u.price === items[idx].price && u.subtotal === items[idx].subtotal
    );
    if (!unchanged) {
      setItems(updated);
    }
  }, [items, offers]);

  const removeItem = (id: number) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // subtotal already uses discounted unit prices when an offer is active
  const subtotal = items.reduce((sum, i) => sum + i.quantity * Number(i.price), 0);
  let discountAmount = 0;
  let total = subtotal;
  if (applicableOffers.length > 0) {
    // compute discount by comparing with original price of items considering best offer per item
    const originalTotal = items.reduce((sum, i) => {
      const best = applicableOffers.reduce((b, off) => {
        if (off.products.some(p => p.id === i.id)) {
          return Math.max(b, off.discount);
        }
        return b;
      }, 0);
      const origPrice = best > 0 ? Number(i.price) / (1 - best / 100) : Number(i.price);
      return sum + i.quantity * origPrice;
    }, 0);
    discountAmount = +(originalTotal - subtotal).toFixed(2);
    total = +(subtotal).toFixed(2);
  }

  const handleSubmit = async () => {
    // guard against double submission: do nothing if already processing
    if (loading || submittingRef) return;

    if (!localId) return alert("Selecciona un local.");
    if (items.length === 0) return alert("Agrega al menos un producto.");
    if (items.some((item) => item.quantity > item.stock))
      return alert("La cantidad supera el stock disponible.");

    setSubmittingRef(true);
    setLoading(true);
    try {
      await router.post(
        route("sales.store"),
        {
          local_id: localId,
          products: items.map((i) => ({
            id: i.id,
            quantity: i.quantity,
          })),
          customer_name,
          total,
        },
        {
          preserveScroll: true,
          onSuccess: () => {
            setCustomerName("");
            setItems([]);
            setSearch("");
          },
        }
      );
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingRef(false);
    }
  };

  // Abrir modal de productos del local
  const openModal = async () => {
    if (!localId) {
      return alert("Selecciona un local primero.");
    }

    setLoadingProducts(true);
    setShowModal(true);

    try {
      const res = await axios.get(route("api.products.byLocal"), {
        params: { local_id: localId },
      });
      setLocalProducts(res.data.map((p: any) => ({ ...p, selected: false })));

      //setLocalProducts(res.data);
    } catch (err) {
      console.error(err);
      setLocalProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nueva Venta" />

      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Registrar Venta</h1>

        {flash.success && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-700 border border-green-300">
            {flash.success}
          </div>
        )}

        {/* Local */}
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

        
        {/* Scanner */}
        <div className="relative mb-6 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();

                if (results.length === 1) {
                  addItem(results[0]);
                  setSearch("");
                  setResults([]);
                }
              }
            }}
            placeholder="Buscar producto..."
            className="w-full border rounded-lg px-3 py-2"
          />

          {results.length > 0 && (
          <ul className="absolute z-10 bg-white dark:bg-gray-800 border rounded-lg mt-12 w-full">
            {results.map((product) => (
              <li
                key={product.id}
                onClick={() => {
                  addItem(product);
                  setSearch("");
                  setResults([]);
                }}
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                {product.name} — ${product.price}
              </li>
            ))}
          </ul>
        )}

          <button
            className="bg-gray-700 text-white px-4 rounded-lg"
            onClick={openModal}
          >
            Ver productos
          </button>

          <button
            className="bg-green-600 text-white px-4 rounded-lg"
            onClick={() => setShowScanner(true)}
          >
            📷 Escanear
          </button>
        </div>

        

        <BarcodeScannerModal
          isOpen={showScanner}
          onDetected={handleBarcodeDetected}
          onClose={() => setShowScanner(false)}
        />

        {/* Tabla productos agregados */}
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
                  <td className="p-2 text-center">
                ${item.price}
                {applicableOffers.some(off => off.products.some(p=>p.id===item.id)) && (
                  <span className="text-xs text-gray-500 block">(original: ${item.basePrice})</span>
                )}
              </td>
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

        {/* Total */}
        <div className="flex flex-col items-end mb-2">
          {applicableOffers.length > 0 && (
            <span className="text-sm text-gray-600">
              Aplicando oferta(s) {applicableOffers.map(o => `"${o.name}"`).join(', ')}: -${discountAmount}
            </span>
          )}
          <span className="text-xl font-semibold">Total: ${total}</span>
        </div>
        <div className="flex justify-between items-center">
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

      {/* MODAL DE PRODUCTOS */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 w-full max-w-2xl rounded-lg shadow-lg relative">

            <h2 className="text-xl font-semibold mb-4">
              Seleccionar productos
            </h2>

            {/* Botón agregar seleccionados */}
            <div className="flex justify-end mb-3">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={localProducts.length === 0}
                onClick={() => {
                  const selectedProducts = localProducts.filter(p => p.selected);

                  selectedProducts.forEach(p => addItem(p));

                  setLocalProducts(prev => prev.map(p => ({ ...p, selected: false })));
                  setShowModal(false);
                }}

              >
                Agregar seleccionados
              </button>
            </div>

            {loadingProducts ? (
              <p className="text-center py-4">Cargando productos...</p>
            ) : localProducts.length === 0 ? (
              <p className="text-center py-4 text-gray-500">
                No hay productos en este local.
              </p>
            ) : (
              <div className="max-h-80 overflow-y-auto border rounded">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="p-2 text-center">✔</th>
                      <th className="p-2 text-left">Producto</th>
                      <th className="p-2">Precio</th>
                      <th className="p-2">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localProducts.map((product) => (
                      <tr key={product.id} className="border-t">
                        <td className="p-2 text-center">
                          <input
                            type="checkbox"
                            checked={product.selected || false}
                            onChange={(e) => {
                              setLocalProducts(prev =>
                                prev.map(p =>
                                  p.id === product.id
                                    ? { ...p, selected: e.target.checked }
                                    : p
                                )
                              );
                            }}
                          />
                        </td>
                        <td className="p-2">{product.name}</td>
                        <td className="p-2 text-center">${product.price}</td>
                        <td className="p-2 text-center">{product.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Botón cerrar */}
            <button
              className="absolute top-2 right-3 text-gray-600 text-xl"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </AppLayout>
  );
}

