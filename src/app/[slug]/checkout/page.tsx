"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { getWebsiteSettings } from "@/services/api";
import type { WebsiteSettingsResponse } from "@/types";
import Image from "next/image";
import dynamic from 'next/dynamic';

// Dynamic imports to prevent hydration issues
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { cartItems, getCartTotal, clearCart } = useCart();

  const [customer, setCustomer] = useState({ name: "", phoneNumber: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");
  const [mounted, setMounted] = useState(false);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettingsResponse | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  // Ensure component is mounted on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch website settings
  useEffect(() => {
    const fetchWebsiteSettings = async () => {
      if (!mounted || !slug) return;
      
      try {
        setSettingsLoading(true);
        const response = await getWebsiteSettings(slug);
        if (response.isSuccessful) {
          setWebsiteSettings(response);
        }
      } catch (err) {
        console.error('Website settings fetch error:', err);
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchWebsiteSettings();
  }, [slug, mounted]);

  async function handleOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOrderError("");
    setOrderSuccess("");

    // Get tenant identifier from website settings
    const tenantIdentifier = websiteSettings?.data?.tenantIdentifier;
    if (!tenantIdentifier) {
      setOrderError("Unable to get tenant information. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const orderPayload = {
        tenantIdentifier: tenantIdentifier,
        customer,
        totalAmount: total,
        source: 1, // Website
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
        })),
      };

      const response = await fetch("https://api.salonyai.com/api/Order", {
        method: "POST",
        headers: {
          accept: "text/plain",
          "content-type": "application/json",
          "x-tenant-identifier": tenantIdentifier,
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok || !data.isSuccessful) {
        throw new Error(data?.message || "Order failed");
      }

      setOrderSuccess("Order placed successfully!");
      clearCart();
      setTimeout(() => {
        router.push(`/${slug}`);
      }, 2000);
    } catch (err: any) {
      setOrderError(err.message || "Order failed");
    } finally {
      setLoading(false);
    }
  }

  // Prevent hydration issues by not rendering until mounted
  if (!mounted || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const themeColor = websiteSettings?.data?.themeColor || '#2f27ce';
  const deliveryDays = websiteSettings?.data?.deliveryDays || 0;
  const shippingCostFromSettings = websiteSettings?.data?.shippingCost || 0;
  
  // Calculate order totals
  const subtotal = getCartTotal();
  const shippingCost = shippingCostFromSettings;
  const tax = 0; // Static tax value
  const total = subtotal + shippingCost + tax;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        logoUrl={websiteSettings?.data?.logoUrl || '/SalonyAI-Icon.png'} 
        slug={slug} 
        themeColor={themeColor}
      />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 flex items-center">
            <button 
              onClick={() => router.push(`/${slug}/cart`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Cart</span>
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Checkout</h1>
              <p className="text-gray-600">Complete your order</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Form - Left Column */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Customer Information</h2>
              <form onSubmit={handleOrder} className="space-y-6">
                <div>
                  <label className="block font-medium mb-2 text-gray-700">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={customer.name}
                    onChange={e => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2 text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={customer.phoneNumber}
                    onChange={e => setCustomer({ ...customer, phoneNumber: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2 text-gray-700">Address</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    value={customer.address}
                    onChange={e => setCustomer({ ...customer, address: e.target.value })}
                    placeholder="Enter your complete address"
                  />
                </div>
                
                {orderError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {orderError}
                  </div>
                )}
                
                {orderSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    {orderSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 rounded-lg text-white font-semibold text-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{ backgroundColor: themeColor }}
                  disabled={loading}
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            </div>

            {/* Order Summary - Right Column */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
                             {/* Order Items */}
               <div className="space-y-4 mb-6">
                 {cartItems.map(item => (
                   <div key={item.productId} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                     <div className="w-16 h-16 relative flex-shrink-0">
                       <Image
                         src={item.imageUrl}
                         alt={item.name}
                         fill
                         className="object-cover rounded-lg"
                         sizes="64px"
                       />
                     </div>
                     <div className="flex-1 min-w-0">
                       <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                       <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                       <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                     </div>
                     <div className="font-bold text-gray-800">
                       ${(item.price * item.quantity).toFixed(2)}
                     </div>
                   </div>
                 ))}
               </div>

               {/* Order Totals */}
               <div className="border-t pt-4 space-y-2 mb-6">
                 <div className="flex justify-between text-gray-600">
                   <span>Subtotal</span>
                   <span>${subtotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-gray-600">
                   <span>Shipping</span>
                   <span>${shippingCost.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-gray-600">
                   <span>Tax</span>
                   <span>${tax.toFixed(2)}</span>
                 </div>
                 <div className="border-t pt-2">
                   <div className="flex justify-between text-lg font-bold text-gray-800">
                     <span>Total</span>
                     <span>${total.toFixed(2)}</span>
                   </div>
                 </div>
               </div>

               {/* Badges */}
               <div className="space-y-3">
                 {/* Free Shipping Badge */}
                 {shippingCostFromSettings === 0 && (
                   <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                     </svg>
                     <span className="font-medium">Free Shipping</span>
                   </div>
                 )}

                 {/* Cash on Delivery Badge */}
                 <div className="bg-blue-100 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex items-center gap-2">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                   </svg>
                   <span className="font-medium">Cash on Delivery</span>
                 </div>

                 {/* Business Days Badge */}
                 <div className="bg-purple-100 border border-purple-200 text-purple-800 px-4 py-3 rounded-lg flex items-center gap-2">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                   </svg>
                   <span className="font-medium">{deliveryDays} Business Days Delivery</span>
                 </div>
               </div>
            </div>
          </div>
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