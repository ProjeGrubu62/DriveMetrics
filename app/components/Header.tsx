'use client'

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">DriveMetrics</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <Link href="/vehicle-setup" className="text-gray-700 hover:text-gray-900 px-3 py-2">
              Vehicle Setup
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
} 