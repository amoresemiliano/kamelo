import type { Metadata } from 'next';
import { Suspense } from 'react';
import Navigation from '@/components/Navigation';
import ToastContainer from '@/components/ToastContainer';
import QuickModals from '@/components/QuickModals';
import { KameloProvider } from '@/context/KameloContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'MEJUNJE | Atelier de Aromas',
  description: 'Plataforma interna de gestión de laboratorio, materias primas botánicas, fórmulas de autor, compras agrupadas, clientes, proveedores y catálogo para MEJUNJE · Buenos Aires.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-mejunje-fondo text-mejunje-carbon flex flex-col antialiased selection:bg-mejunje-arena selection:text-mejunje-carbon font-typewriter">
        <KameloProvider>
          <Suspense fallback={<header className="h-16 bg-white border-b border-mejunje-border" />}>
            <Navigation />
          </Suspense>
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <footer className="bg-white text-mejunje-secundario border-t border-mejunje-border py-8 px-4 text-center text-xs">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-typewriter text-mejunje-carbon font-bold tracking-widest text-sm">MEJUNJE</span>
                <span className="text-mejunje-arena">·</span>
                <span className="font-typewriter text-[11px] uppercase tracking-wider text-mejunje-verdeprofundo font-bold">Atelier de Aromas</span>
              </div>
              <p className="font-typewriter text-[11px] text-mejunje-secundario tracking-wider">
                mezcla. intención. aroma. · Buenos Aires
              </p>
            </div>
          </footer>
          <ToastContainer />
          <QuickModals />
        </KameloProvider>
      </body>
    </html>
  );
}
