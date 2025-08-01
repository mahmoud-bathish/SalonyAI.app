'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getWebsiteSettings } from '@/services/api';
import type { WebsiteSettingsResponse } from '@/types';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Dynamic imports to prevent hydration issues
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });
const Categories = dynamic(() => import('@/components/Categories'), { ssr: false });

export default function SlugPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchWebsiteSettings = async () => {
      if (!mounted || !slug) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await getWebsiteSettings(slug);
        
        if (!response.isSuccessful) {
          throw new Error(response.message || 'Failed to load website settings');
        }
        
        setWebsiteSettings(response);
      } catch (err) {
        console.error('Website settings fetch error:', err);
        if (err instanceof Error) {
          if (err.message.includes('404')) {
            setError(`Website "${slug}" not found. Please check the slug and try again.`);
          } else if (err.message.includes('Failed to fetch')) {
            setError('Network error. Please check your internet connection and try again.');
          } else {
            setError(err.message);
          }
        } else {
          setError('An unexpected error occurred while loading the website settings.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWebsiteSettings();
  }, [slug, mounted]);

  // Prevent hydration issues by not rendering until mounted
  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !websiteSettings?.isSuccessful) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">Website Not Found</h1>
          <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base mb-6">
            The website you're looking for doesn't exist. Want to create your own?
          </p>
          <button 
            onClick={() => window.open('https://salonyai.com', '_blank')} 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm sm:text-base font-medium"
          >
            Make It Yours
          </button>
        </div>
      </div>
    );
  }

  const settings = websiteSettings.data;

  return (
    <LanguageProvider supportedLanguages={settings.supportedLanguages}>
      <div className="min-h-screen flex flex-col">
        <Navbar 
          logoUrl={settings.logoUrl || '/SalonyAI-Icon.png'} 
          slug={settings.slug} 
          themeColor={settings.themeColor || '#2f27ce'}
        />
        
        <main className="flex-1">
          <Categories tenantIdentifier={settings.tenantIdentifier} />
        </main>
        
        <Footer 
          address_En={settings.address_En}
          address_Ar={settings.address_Ar}
          themeColor={settings.themeColor || '#2f27ce'}
          slug={settings.slug}
          youtubeLink={settings.youtubeLink}
          facebookLink={settings.facebookLink}
          instagramLink={settings.instagramLink}
          tikTokLink={settings.tikTokLink}
          linkedInLink={settings.linkedInLink}
          xLink={settings.xLink}
        />
      </div>
    </LanguageProvider>
  );
}