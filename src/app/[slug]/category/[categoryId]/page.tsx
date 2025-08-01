'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ArrowLeft, ShoppingCart, Check } from 'lucide-react';
import { getProducts, getWebsiteSettings } from '@/services/api';
import type { Product, ProductsResponse, WebsiteSettingsResponse } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Dynamic imports to prevent hydration issues
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function CategoryProductsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const categoryId = params.categoryId as string;
  const { addToCart } = useCart();
  const { t, getTranslation, isRTL, selectedLanguage } = useLanguage();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [notification, setNotification] = useState<{ show: boolean; message: string; productId?: number; type: 'success' | 'info' | 'warning' }>({ show: false, message: '', type: 'success' });

  // Ensure component is mounted on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch website settings
  useEffect(() => {
    const fetchWebsiteSettings = async () => {
      if (!mounted || !slug) return;
      
      try {
        const response = await getWebsiteSettings(slug);
        if (response.isSuccessful) {
          setWebsiteSettings(response);
        }
      } catch (err) {
        console.error('Website settings fetch error:', err);
      }
    };

    fetchWebsiteSettings();
  }, [slug, mounted]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!mounted || !categoryId || !websiteSettings?.data?.tenantIdentifier) return;
      
      try {
        setLoading(true);
        setError(null);
        const response: ProductsResponse = await getProducts(websiteSettings.data.tenantIdentifier, parseInt(categoryId), 0, 20);
        
        if (!response.isSuccessful) {
          throw new Error(response.message || 'Failed to load products');
        }
        
        // Filter only active products
        const activeProducts = response.data.filter(product => product.isActive);
        setProducts(activeProducts);
      } catch (err) {
        console.error('Products fetch error:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred while loading products.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, mounted, websiteSettings?.data?.tenantIdentifier]);

  // Helper function to get product image URL
  const getProductImageUrl = (product: Product): string | null => {
    if (product.images && product.images.length > 0) {
      return product.images[0].imageUrl;
    }
    return null;
  };

  // Helper function to get product name using language context
  const getProductName = (product: Product): string => {
    if (!product.translations || product.translations.length === 0) {
      return 'Unnamed Product';
    }
    
    // Try to find translation for selected language (1 for English, 2 for Arabic)
    const translation = product.translations.find(t => t.languageCode === selectedLanguage);
    if (translation) {
      return translation.name;
    }
    
    // Fallback to first available translation
    return product.translations[0].name;
  };

  // Helper function to get product description using language context
  const getProductDescription = (product: Product): string => {
    if (!product.translations || product.translations.length === 0) {
      return '';
    }
    
    // Try to find translation for selected language (1 for English, 2 for Arabic)
    const translation = product.translations.find(t => t.languageCode === selectedLanguage);
    if (translation) {
      return translation.description;
    }
    
    // Fallback to first available translation
    return product.translations[0].description;
  };

  // Handle add to cart with notification
  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    
    // Show notification (we'll use a simple success message for now)
    const message = `${getProductName(product)} ${t('notification.added_to_cart')}`;
    
    setNotification({
      show: true,
      message: message,
      productId: product.id,
      type: 'success'
    });

    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Get theme color
  const themeColor = websiteSettings?.data?.themeColor || '#2f27ce';

  // Prevent hydration issues by not rendering until mounted
  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base mb-4">{error}</p>
          <button 
            onClick={() => router.back()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer text-sm sm:text-base"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

    return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar 
        logoUrl={websiteSettings?.data?.logoUrl || '/SalonyAI-Icon.png'} 
        slug={slug} 
        themeColor={themeColor}
      />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
                      {/* Header */}
            <div className={`mb-8 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                <span>{t('nav.back_to_products')}</span>
              </button>
              <div className="flex-1 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('products.title')}</h1>
                <p className="text-gray-600">{t('products.subtitle')}</p>
              </div>
            </div>

          {/* Notification */}
          {notification.show && (
            <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right duration-300 ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'info' ? 'bg-blue-500 text-white' :
              'bg-yellow-500 text-white'
            }`}>
              {notification.type === 'success' && <Check className="w-5 h-5" />}
              {notification.type === 'info' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>}
              {notification.type === 'warning' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>}
              <span className="font-medium">{notification.message}</span>
            </div>
          )}

                     {/* Products Grid */}
           {products.length === 0 ? (
             <div className="text-center py-12">
               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                 </svg>
               </div>
               <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('products.no_products')}</h3>
               <p className="text-gray-600">{t('products.no_products_message')}</p>
             </div>
          ) : (
                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {products.map((product, index) => (
                 <div
                   key={product.id}
                   className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                 >
                                       <div className="aspect-square bg-gray-100 overflow-hidden relative">
                      {(() => {
                        const imageUrl = getProductImageUrl(product);
                        return imageUrl && imageUrl.trim() !== '' ? (
                          <Image
                            src={imageUrl}
                            alt={getProductName(product)}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            priority={index === 0}
                            onError={(e) => {
                              // Hide the image if it fails to load
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                        );
                      })()}
                      {(() => {
                        const imageUrl = getProductImageUrl(product);
                        return !imageUrl || imageUrl.trim() === '' ? (
                          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                            No Image
                          </div>
                        ) : null;
                      })()}
                    {product.stockQuantity <= 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {getProductName(product)}
                    </h3>
                    {getProductDescription(product) && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {getProductDescription(product)}
                      </p>
                    )}
                                         <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : 'justify-between'}`}>
                       <span className="text-2xl font-bold text-gray-800">
                         ${product.price.toFixed(2)}
                       </span>
                       <button 
                         className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-105"
                                                  style={{ 
                           backgroundColor: product.stockQuantity > 0 ? (themeColor || '#2f27ce') : '#6b7280'
                         }}
                         disabled={product.stockQuantity <= 0}
                         onClick={() => handleAddToCart(product)}
                       >
                         <ShoppingCart className="w-4 h-4" />
                         <span className="text-sm font-medium">
                           {product.stockQuantity > 0 ? t('products.add_to_cart') : t('products.out_of_stock')}
                         </span>
                       </button>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
             <Footer 
         address_En={websiteSettings?.data?.address_En || "Tripoli, Abu samra, Imad street"}
         address_Ar={websiteSettings?.data?.address_Ar}
         themeColor={themeColor}
         slug={slug}
         youtubeLink={websiteSettings?.data?.youtubeLink || "https://youtube.com"}
         facebookLink={websiteSettings?.data?.facebookLink || "https://facebook.com"}
         instagramLink={websiteSettings?.data?.instagramLink || "https://instagram.com"}
         tikTokLink={websiteSettings?.data?.tikTokLink || "https://tiktok.com"}
         linkedInLink={websiteSettings?.data?.linkedInLink || "https://linkedin.com"}
         xLink={websiteSettings?.data?.xLink || "https://x.com"}
       />
    </div>
  );
} 