'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavbarProps {
  logoUrl: string;
  slug: string;
  themeColor: string;
}

export default function Navbar({ logoUrl, slug, themeColor }: NavbarProps) {
  const router = useRouter();
  const { getCartItemCount } = useCart();
  const { t, isRTL, selectedLanguage, setSelectedLanguage, supportedLanguages } = useLanguage();
  const cartItemCount = getCartItemCount();

  // Function to toggle between languages
  const toggleLanguage = () => {
    if (supportedLanguages.length > 1) {
      const currentLang = selectedLanguage;
      const nextLang = currentLang === 1 ? 2 : 1;
      if (supportedLanguages.includes(nextLang)) {
        setSelectedLanguage(nextLang as any);
      }
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Logo */}
            <Link 
              href={`/${slug}`}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                {logoUrl && logoUrl.trim() !== '' ? (
                  <Image
                    src={logoUrl}
                    alt="Logo"
                    width={48}
                    height={48}
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
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
            </Link>

            {/* Cart and Language Toggle Group */}
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* Language Toggle Button */}
              {supportedLanguages.length > 1 && (
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                  style={{ 
                    backgroundColor: `${themeColor || '#2f27ce'}15`,
                    border: `1px solid ${themeColor || '#2f27ce'}30`
                  }}
                  title={t('language.toggle')}
                >
                  {/* Flag Icon */}
                  <div 
                    className="w-5 h-4 rounded-sm flex items-center justify-center text-xs font-bold"
                    style={{ 
                      backgroundColor: selectedLanguage === 1 ? '#1d4ed8' : '#059669',
                      color: 'white'
                    }}
                  >
                    {selectedLanguage === 1 ? '🇺🇸' : '🇸🇦'}
                  </div>
                  {/* Language Text */}
                  <span 
                    className="text-sm font-medium hidden sm:inline"
                    style={{ color: themeColor || '#2f27ce' }}
                  >
                    {selectedLanguage === 1 ? t('language.english') : t('language.arabic')}
                  </span>
                  <span 
                    className="text-sm font-medium sm:hidden"
                    style={{ color: themeColor || '#2f27ce' }}
                  >
                    {selectedLanguage === 1 ? t('language.en') : t('language.ar')}
                  </span>
                </button>
              )}

              {/* Cart Button */}
              <button
                onClick={() => router.push(`/${slug}/cart`)}
                className="relative flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">{t('nav.cart')}</span>
                {cartItemCount > 0 && (
                  <span 
                    className={`absolute text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium ${
                      isRTL ? '-top-2 -left-2' : '-top-2 -right-2'
                    }`}
                    style={{ backgroundColor: themeColor || '#2f27ce' }}
                  >
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}