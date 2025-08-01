'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Language enum matching the backend
export enum LanguageCode {
  English = 1,
  Arabic = 2
}

export interface LanguageContextType {
  selectedLanguage: LanguageCode;
  setSelectedLanguage: (language: LanguageCode) => void;
  isRTL: boolean;
  supportedLanguages: number[];
  t: (key: string, fallback?: string) => string;
  getTranslation: <T extends { translations: Array<{ languageCode: number; name: string; description: string }> }>(
    item: T,
    field: 'name' | 'description'
  ) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<LanguageCode, Record<string, string>> = {
  [LanguageCode.English]: {
    // Navigation
    'nav.home': 'Home',
    'nav.cart': 'Cart',
    'nav.back': 'Back',
    'nav.back_to_products': 'Back to Products',
    'nav.back_to_cart': 'Back to Cart',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.items_count': 'item in your cart',
    'cart.items_count_plural': 'items in your cart',
    'cart.clear_cart': 'Clear Cart',
    'cart.continue_shopping': 'Continue Shopping',
    'cart.proceed_to_checkout': 'Proceed to Checkout',
    'cart.order_summary': 'Order Summary',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.tax': 'Tax',
    'cart.total': 'Total',
    'cart.free': 'Free',
    'cart.quantity': 'Quantity',
    'cart.remove': 'Remove',
    
    // Checkout
    'checkout.title': 'Checkout',
    'checkout.subtitle': 'Complete your order',
    'checkout.customer_info': 'Customer Information',
    'checkout.full_name': 'Full Name',
    'checkout.phone_number': 'Phone Number',
    'checkout.address': 'Address',
    'checkout.place_order': 'Place Order',
    'checkout.placing_order': 'Placing Order...',
    'checkout.order_summary': 'Order Summary',
    'checkout.free_shipping': 'Free Shipping',
    'checkout.cash_on_delivery': 'Cash on Delivery',
    'checkout.business_days_delivery': 'Business Days Delivery',
    
    // Products
    'products.title': 'Products',
    'products.subtitle': 'Browse our products in this category',
    'products.add_to_cart': 'Add to Cart',
    'products.out_of_stock': 'Out of Stock',
    'products.no_products': 'No Products Available',
    'products.no_products_message': "We're currently setting up products for this category. Please check back soon!",
    
    // Categories
    'categories.title': 'Categories',
    'categories.subtitle': 'Browse our product categories',
    'categories.explore': 'Explore',
    'categories.no_categories': 'No Categories Available',
    'categories.no_categories_message': "We're currently setting up categories. Please check back soon!",
    
    // Notifications
    'notification.added_to_cart': 'added to cart!',
    'notification.max_stock': 'is already at maximum stock in your cart!',
    
    // Form placeholders
    'placeholder.full_name': 'Enter your full name',
    'placeholder.phone': 'Enter your phone number',
    'placeholder.address': 'Enter your complete address',
    
    // Errors
    'error.general': 'An error occurred',
    'error.network': 'Network error. Please check your connection.',
    'error.loading': 'Failed to load data',
    
    // Language selection
    'language.select': 'Select Language',
    'language.english': 'English',
    'language.arabic': 'العربية',
    'language.continue': 'Continue',
    'language.toggle': 'Language',
    'language.en': 'EN',
    'language.ar': 'ع',
    
    // Footer
    'footer.copyright': 'All rights reserved.',
    'footer.powered_by': 'Powered by',
  },
  [LanguageCode.Arabic]: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.cart': 'السلة',
    'nav.back': 'رجوع',
    'nav.back_to_products': 'العودة للمنتجات',
    'nav.back_to_cart': 'العودة للسلة',
    
    // Cart
    'cart.title': 'سلة التسوق',
    'cart.empty': 'سلة التسوق فارغة',
    'cart.items_count': 'منتج في السلة',
    'cart.items_count_plural': 'منتجات في السلة',
    'cart.clear_cart': 'إفراغ السلة',
    'cart.continue_shopping': 'مواصلة التسوق',
    'cart.proceed_to_checkout': 'إتمام الطلب',
    'cart.order_summary': 'ملخص الطلب',
    'cart.subtotal': 'المجموع الفرعي',
    'cart.shipping': 'الشحن',
    'cart.tax': 'الضريبة',
    'cart.total': 'المجموع الكلي',
    'cart.free': 'مجاني',
    'cart.quantity': 'الكمية',
    'cart.remove': 'إزالة',
    
    // Checkout
    'checkout.title': 'إتمام الطلب',
    'checkout.subtitle': 'أكمل طلبك',
    'checkout.customer_info': 'معلومات العميل',
    'checkout.full_name': 'الاسم الكامل',
    'checkout.phone_number': 'رقم الهاتف',
    'checkout.address': 'العنوان',
    'checkout.place_order': 'إتمام الطلب',
    'checkout.placing_order': 'جاري إتمام الطلب...',
    'checkout.order_summary': 'ملخص الطلب',
    'checkout.free_shipping': 'شحن مجاني',
    'checkout.cash_on_delivery': 'الدفع عند الاستلام',
    'checkout.business_days_delivery': 'أيام عمل للتوصيل',
    
    // Products
    'products.title': 'المنتجات',
    'products.subtitle': 'تصفح منتجاتنا في هذه الفئة',
    'products.add_to_cart': 'أضف للسلة',
    'products.out_of_stock': 'نفذت الكمية',
    'products.no_products': 'لا توجد منتجات متاحة',
    'products.no_products_message': 'نحن نقوم حالياً بإعداد المنتجات لهذه الفئة. يرجى العودة قريباً!',
    
    // Categories
    'categories.title': 'الفئات',
    'categories.subtitle': 'تصفح فئات منتجاتنا',
    'categories.explore': 'استكشف',
    'categories.no_categories': 'لا توجد فئات متاحة',
    'categories.no_categories_message': 'نحن نقوم حالياً بإعداد الفئات. يرجى العودة قريباً!',
    
    // Notifications
    'notification.added_to_cart': 'تمت الإضافة للسلة!',
    'notification.max_stock': 'وصل للحد الأقصى في السلة!',
    
    // Form placeholders
    'placeholder.full_name': 'أدخل اسمك الكامل',
    'placeholder.phone': 'أدخل رقم هاتفك',
    'placeholder.address': 'أدخل عنوانك الكامل',
    
    // Errors
    'error.general': 'حدث خطأ',
    'error.network': 'خطأ في الشبكة. يرجى التحقق من الاتصال.',
    'error.loading': 'فشل في تحميل البيانات',
    
    // Language selection
    'language.select': 'اختر اللغة',
    'language.english': 'English',
    'language.arabic': 'العربية',
    'language.continue': 'متابعة',
    'language.toggle': 'اللغة',
    'language.en': 'EN',
    'language.ar': 'ع',
    
    // Footer
    'footer.copyright': 'جميع الحقوق محفوظة.',
    'footer.powered_by': 'مدعوم بواسطة',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
  supportedLanguages: number[];
}

export function LanguageProvider({ children, supportedLanguages }: LanguageProviderProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(LanguageCode.English);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // Check if language selection is needed
  useEffect(() => {
    if (supportedLanguages.length > 1) {
      const savedLanguage = localStorage.getItem('selectedLanguage');
      if (savedLanguage) {
        setSelectedLanguage(Number(savedLanguage) as LanguageCode);
      } else {
        setShowLanguageSelector(true);
      }
    }
  }, [supportedLanguages]);

  const handleLanguageSelect = (language: LanguageCode) => {
    setSelectedLanguage(language);
    localStorage.setItem('selectedLanguage', language.toString());
    setShowLanguageSelector(false);
  };

  const isRTL = selectedLanguage === LanguageCode.Arabic;

  const t = (key: string, fallback?: string): string => {
    return translations[selectedLanguage][key] || fallback || key;
  };

  const getTranslation = <T extends { translations: Array<{ languageCode: number; name: string; description: string }> }>(
    item: T,
    field: 'name' | 'description'
  ): string => {
    if (!item.translations || item.translations.length === 0) {
      return field === 'name' ? 'Unnamed' : '';
    }
    
    // Try to find translation for selected language
    const translation = item.translations.find(t => t.languageCode === selectedLanguage);
    if (translation) {
      return translation[field];
    }
    
    // Fallback to first available translation
    return item.translations[0][field];
  };

  const value: LanguageContextType = {
    selectedLanguage,
    setSelectedLanguage: handleLanguageSelect,
    isRTL,
    supportedLanguages,
    t,
    getTranslation,
  };

  return (
    <LanguageContext.Provider value={value}>
      {showLanguageSelector && supportedLanguages.length > 1 && (
        <LanguageSelector 
          supportedLanguages={supportedLanguages}
          onSelect={handleLanguageSelect}
        />
      )}
      {children}
    </LanguageContext.Provider>
  );
}

// Language Selector Component
interface LanguageSelectorProps {
  supportedLanguages: number[];
  onSelect: (language: LanguageCode) => void;
}

function LanguageSelector({ supportedLanguages, onSelect }: LanguageSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Select Language / اختر اللغة
        </h2>
        <div className="space-y-4">
          {supportedLanguages.includes(LanguageCode.English) && (
            <button
              onClick={() => onSelect(LanguageCode.English)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  EN
                </div>
                <div>
                  <div className="font-semibold text-gray-800">English</div>
                  <div className="text-sm text-gray-500">English language</div>
                </div>
              </div>
            </button>
          )}
          
          {supportedLanguages.includes(LanguageCode.Arabic) && (
            <button
              onClick={() => onSelect(LanguageCode.Arabic)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  ع
                </div>
                <div>
                  <div className="font-semibold text-gray-800">العربية</div>
                  <div className="text-sm text-gray-500">اللغة العربية</div>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 