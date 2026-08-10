import type { Metadata } from 'next';
import { Suspense } from 'react';
import Navigation from '@/components/Navigation';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kamelo Aromáticos | Plataforma Interna',
  description: 'Gestión integral de fórmulas, laboratorio, compras agrupadas por proveedor e inteligencia de mercado ARS para Kamelo Aromáticos.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#F7F4EE] text-[#2A1E17] flex flex-col antialiased selection:bg-[#C86D51] selection:text-white">
        <Suspense fallback={<header className="h-16 bg-[#2A1E17] border-b border-[#3D2C22]" />}>
          <Navigation />
        </Suspense>
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <footer className="bg-[#2A1E17] text-[#E6DFC8] border-t border-[#3D2C22] py-6 px-4 text-center text-xs">
          <p>© 2026 Kamelo Aromáticos. Todos los derechos reservados. Sistema interno de laboratorio y compras ARS.</p>
        </footer>
      </body>
    </html>
  );
}
