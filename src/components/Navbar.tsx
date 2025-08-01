'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface NavbarProps {
  logoUrl: string;
  slug: string;
  themeColor: string;
}

export default function Navbar({ logoUrl, slug, themeColor }: NavbarProps) {
  const router = useRouter();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();

  return (
    <nav className="bg-white shadow-sm">
      <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Slug */}
            <Link 
              href={`/${slug}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                {logoUrl && logoUrl.trim() !== '' ? (
                  <Image
                    src={logoUrl}
                    alt="Logo"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      // If the logo fails to load, show the default SalonyAI icon
                      e.currentTarget.src = '/SalonyAI-Icon.png';
                    }}
                  />
                ) : (
                  <Image
                    src="/SalonyAI-Icon.png"
                    alt="SalonyAI Logo"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
              <span className="text-xl font-semibold text-gray-800">{slug}</span>
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => router.push(`/${slug}/cart`)}
              className="relative flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartItemCount > 0 && (
                <span 
                  className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                  style={{ backgroundColor: themeColor || '#2f27ce' }}
                >
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}