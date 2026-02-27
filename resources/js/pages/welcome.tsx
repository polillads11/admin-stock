import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import logo from '../assets/Logo.png';

interface Auth {
    user: { name: string; email: string } | null;
}

export default function Welcome({ auth }: { auth: Auth }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">

            {/* Navbar */}
            <header className="flex justify-between items-center px-6 py-2 bg-white shadow-sm">
                {/*<h1 className="text-2xl font-bold text-blue-700">
                    StockPro
                </h1>*/}
                <div className="flex items-center gap-3">
                    <img
                        src={logo}
                        alt="StockPro Logo"
                        className="h-20 w-auto"
                    />
                </div>

                <div className="space-x-4">
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="text-blue-600 hover:underline"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="text-gray-600 hover:text-blue-600"
                            >
                                Iniciar sesión
                            </Link>

                            <Link
                                href={route('register')}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>
            </header>

            {/* Hero */}
            <main className="flex-1 flex flex-col justify-center items-center text-center px-6">

                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                    Gestión Inteligente de Stock
                </h2>

                <p className="text-lg text-gray-600 max-w-2xl mb-8">
                    Sistema de administración diseñado para kioscos, almacenes
                    y pequeños comercios. Controlá productos, ventas y movimientos
                    de inventario en tiempo real.
                </p>

                {!auth.user && (
                    <div className="flex gap-4">
                        <Link
                            href={route('login')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Comenzar ahora
                        </Link>
                    </div>
                )}

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl w-full">
                    <Feature
                        title="Control de Productos"
                        description="Alta, edición y control de stock con alertas automáticas."
                    />
                    <Feature
                        title="Ventas Rápidas"
                        description="Registro simple de ventas con descuento automático del inventario."
                    />
                    <Feature
                        title="Reportes Inteligentes"
                        description="Análisis de productos más vendidos y ganancias."
                    />
                </div>

            </main>
        </div>
    );
}

function Feature({ title, description }: { title: string; description: string }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-xl mb-3 text-blue-700">
                {title}
            </h3>
            <p className="text-gray-600">
                {description}
            </p>
        </div>
    );
}