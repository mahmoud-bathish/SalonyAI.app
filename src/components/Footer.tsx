import { Facebook, Instagram, Linkedin, Twitter, Youtube, MapPin } from 'lucide-react';
import type { FooterProps } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer({ 
  address_En, 
  address_Ar, 
  themeColor, 
  youtubeLink, 
  facebookLink, 
  instagramLink, 
  tikTokLink, 
  linkedInLink, 
  xLink,
  slug
}: FooterProps) {
  const { selectedLanguage, isRTL, t } = useLanguage();
  
  // Use the appropriate address based on selected language
  const address = selectedLanguage === 2 ? (address_Ar || address_En) : address_En;
  // Validate themeColor - ensure it's a valid color and not just "string"
  const validThemeColor = themeColor && 
    themeColor !== 'string' && 
    themeColor.trim() !== '' 
    ? themeColor 
    : '#2f27ce'; // Default to the new brand color if invalid

  // Filter out empty or null social media links
  const socialLinks = [
    { name: 'YouTube', url: youtubeLink, icon: Youtube },
    { name: 'Facebook', url: facebookLink, icon: Facebook },
    { name: 'Instagram', url: instagramLink, icon: Instagram },
    { name: 'LinkedIn', url: linkedInLink, icon: Linkedin },
    { name: 'X (Twitter)', url: xLink, icon: Twitter },
  ].filter(link => link.url && link.url.trim() !== '');

  return (
    <footer className="w-full relative">
      {/* Subtle top border with gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      
      <div className="w-full" style={{ backgroundColor: `${validThemeColor}10` }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
        <div className={`flex flex-col md:flex-row items-center justify-between gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        {/* Address */}
            {address && (
              <div className={`text-center ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'justify-center md:justify-end' : 'justify-center md:justify-start'}`}>
                  <MapPin className="w-4 h-4" style={{ color: validThemeColor }} />
                  <p className="text-sm" style={{ color: validThemeColor }}>
                    {address}
                  </p>
                </div>
              </div>
            )}

            {/* Social Media Links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3">
                {socialLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 group cursor-pointer"
                      style={{
                        backgroundColor: `${validThemeColor}20`,
                        color: validThemeColor,
                      }}
                      title={link.name}
                    >
                      <IconComponent 
                        className="w-4 h-4 transition-all duration-200 group-hover:scale-110" 
                        style={{
                          color: 'inherit',
                        }}
                      />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Copyright */}
          <div className="mt-4 pt-4 text-center">
            {/* Subtle separator line */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>
            <p className="text-xs" style={{ color: validThemeColor }}>
              &copy; {new Date().getFullYear()} {slug}. {t('footer.copyright')}
            </p>
            <a 
              href="https://salonyai.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs mt-1 block hover:opacity-80 transition-opacity cursor-pointer"
              style={{ color: `${validThemeColor}80` }}
            >
              {t('footer.powered_by')} SalonyAI
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}