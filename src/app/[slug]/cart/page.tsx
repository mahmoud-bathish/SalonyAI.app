'use client';

import { useEffect, useState, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { getWebsiteSettings } from '@/services/api';
import type { WebsiteSettingsResponse } from '@/types';
import { useCart } from '@/contexts/CartContext';

// Dynamic imports to prevent hydration issues
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function CartPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartItemCount, getCartTotal } = useCart();
  
  const [mounted, setMounted] = useState(false);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettingsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Ensure component is mounted on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch website settings
  useEffect(() => {
    const fetchWebsiteSettings = async () => {
      if (!mounted || !slug) return;
      
      try {
        setLoading(true);
        const response = await getWebsiteSettings(slug);
        if (response.isSuccessful) {
          setWebsiteSettings(response);
        }
      } catch (err) {
        console.error('Website settings fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWebsiteSettings();
  }, [slug, mounted]);

  // Calculate totals
  const subtotal = getCartTotal();
  const totalItems = getCartItemCount();
  const shippingCost = websiteSettings?.data?.shippingCost || 0;
  const tax = 0.00; // Static tax value
  const total = subtotal + shippingCost + tax;

  // Prevent hydration issues by not rendering until mounted
  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Get theme color from website settings
  const themeColor = websiteSettings?.data?.themeColor || '#2f27ce';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        logoUrl={websiteSettings?.data?.logoUrl || '/SalonyAI-Icon.png'} 
        slug={slug} 
        themeColor={themeColor}
      />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center">
                         <button 
               onClick={() => router.push(`/${slug}`)}
               className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
             >
               <ArrowLeft className="w-4 h-4" />
               <span>Back to Products</span>
             </button>
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
              <p className="text-gray-600">
                {totalItems === 0 
                  ? 'Your cart is empty' 
                  : `${totalItems} item${totalItems === 1 ? '' : 's'} in your cart`
                }
              </p>
            </div>
            {cartItems.length > 0 && (
              <button 
                onClick={clearCart}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Cart</span>
              </button>
            )}
          </div>

          {/* Cart Items */}
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Cart is Empty</h3>
              <p className="text-gray-600 mb-6">Add some products to get started!</p>
              <button 
                onClick={() => router.push(`/${slug}`)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items List */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                      <div
                        key={item.productId}
                        className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4"
                      >
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                        {item.imageUrl && item.imageUrl.trim() !== '' ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800 truncate">{item.name}</h3>
                        {item.description && (
                          <p className="text-gray-600 text-sm truncate">{item.description}</p>
                        )}
                        <p className="text-lg font-bold text-gray-800">${item.price.toFixed(2)}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stockQuantity}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-gray-800">Total</span>
                        <span className="text-lg font-bold text-gray-800">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    className="w-full text-white py-3 rounded-lg transition-colors font-medium cursor-pointer hover:scale-105"
                    style={{ backgroundColor: themeColor || '#2f27ce' }}
                    onClick={() => router.push(`/${slug}/checkout`)}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer 
        address_En={websiteSettings?.data?.address_En || "Tripoli, Abu samra, Imad street"}
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