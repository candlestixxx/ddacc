import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DDACC | Detroit Digital Artist Convention & Conference',
  description: 'To empower, elevate, and connect digital creators across Detroit and beyond.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen flex flex-col`}>
        <header className="border-b border-gray-800 bg-gray-950 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold tracking-tighter text-blue-400">
              DDACC
            </Link>
            <nav className="space-x-6 text-sm font-medium">
              <Link href="#mission" className="hover:text-blue-400 transition-colors">Mission</Link>
              <Link href="#tracks" className="hover:text-blue-400 transition-colors">Tracks</Link>
              <Link href="#schedule" className="hover:text-blue-400 transition-colors">Schedule</Link>
              <Link href="#apply" className="hover:text-blue-400 transition-colors">Artist Application</Link>
              <Link href="#digital-wall" className="hover:text-blue-400 transition-colors">Digital Wall</Link>
            </nav>
          </div>
        </header>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="border-t border-gray-800 bg-gray-950 py-8 text-center text-gray-500 text-sm">
          <p>© 2026 Detroit Digital Artist Convention & Conference (DDACC). The Love Collective.</p>
        </footer>
      </body>
    </html>
  );
}