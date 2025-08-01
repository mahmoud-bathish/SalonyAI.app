'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getCategories } from '@/services/api';
import type { Category, CategoriesResponse } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoriesProps {
  tenantIdentifier: string;
}

export default function Categories({ tenantIdentifier }: CategoriesProps) {
  const router = useRouter();
  const { t, getTranslation, isRTL, selectedLanguage } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!tenantIdentifier) return;
      
      try {
        setLoading(true);
        setError(null);
        const response: CategoriesResponse = await getCategories(tenantIdentifier, 0, 20);
        
        if (!response.isSuccessful) {
          throw new Error(response.message || 'Failed to load categories');
        }
        
        // Filter only active categories that have translations for the selected language
        const activeCategories = response.data.filter(category => {
          if (!category.isActive) return false;
          
          // Check if category has translations for the selected language
          if (!category.translations || category.translations.length === 0) return false;
          
          const hasTranslation = category.translations.some(t => t.languageCode === selectedLanguage);
          return hasTranslation;
        });
        setCategories(activeCategories);
      } catch (err) {
        console.error('Categories fetch error:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred while loading categories.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [tenantIdentifier]);

  // Helper function to get category name using language context
  const getCategoryName = (category: Category): string => {
    if (!category.translations || category.translations.length === 0) {
      return 'Unnamed Category';
    }
    
    // Try to find translation for selected language (1 for English, 2 for Arabic)
    const translation = category.translations.find(t => t.languageCode === selectedLanguage);
    if (translation) {
      return translation.name;
    }
    
    // Fallback to first available translation
    return category.translations[0].name;
  };

  // Helper function to get category description using language context
  const getCategoryDescription = (category: Category): string => {
    if (!category.translations || category.translations.length === 0) {
      return '';
    }
    
    // Try to find translation for selected language (1 for English, 2 for Arabic)
    const translation = category.translations.find(t => t.languageCode === selectedLanguage);
    if (translation) {
      return translation.description;
    }
    
    // Fallback to first available translation
    return category.translations[0].description;
  };

  // Handle category click
  const handleCategoryClick = (categoryId: number) => {
    // Get the current slug from the URL
    const currentPath = window.location.pathname;
    const slug = currentPath.split('/')[1]; // Get the slug from the URL
    router.push(`/${slug}/category/${categoryId}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{t('categories.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-t-xl"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{t('categories.title')}</h2>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('error.loading')}</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
          >
            {t('error.general')}
          </button>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{t('categories.title')}</h2>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('categories.no_categories')}</h3>
          <p className="text-gray-600">{t('categories.no_categories_message')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('categories.title')}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('categories.subtitle')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="aspect-square bg-gray-100 overflow-hidden relative">
              {category.imageUrl ? (
                <Image
                  src={category.imageUrl}
                  alt={getCategoryName(category)}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority={false}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {getCategoryName(category)}
              </h3>
              {getCategoryDescription(category) && (
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {getCategoryDescription(category)}
                </p>
              )}
              <div className={`flex items-center justify-end`}>
                   <div className={`flex items-center text-blue-600 group-hover:text-blue-700 transition-colors `}>
                     <span className={`text-sm font-medium ${isRTL ? 'ml-1' : 'mr-1'}`}>{t('categories.explore')}</span>
                     <svg className={`w-4 h-4 transform transition-transform ${isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                     </svg>
                   </div>
                 </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}