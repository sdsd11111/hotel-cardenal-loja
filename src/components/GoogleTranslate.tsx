'use client';

import { useEffect, useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
    __googleTranslateInitialized?: boolean;
  }
}

interface GoogleTranslateProps {
  inHeader?: boolean;
  hideUI?: boolean;
  textColor?: string;
}

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
];

export default function GoogleTranslate({ inHeader = false, hideUI = false, textColor }: GoogleTranslateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const initialized = useRef(false);

  useEffect(() => {
    const loadScript = () => {
      if ((window as any).__googleTranslateInitializedScript) return;
      (window as any).__googleTranslateInitializedScript = true;

      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'es',
            includedLanguages: 'en,es,fr,de,it,pt,zh-CN',
            layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    // Load only on main instance or if header is the only one
    if (!inHeader || !document.getElementById('google_translate_element')) {
      // Short delay to avoid blocking initial render
      const timeoutId = setTimeout(() => {
        if (document.readyState === 'complete') {
          loadScript();
        } else {
          window.addEventListener('load', loadScript, { once: true });
        }
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [inHeader]);

  const changeLanguage = (lang: typeof languages[0]) => {
    setCurrentLang(lang);
    setIsOpen(false);

    // Wait for Google Translate to be fully loaded
    const tryChangeLanguage = (attempts = 0) => {
      const maxAttempts = 30; // Increased from 20 for more reliability
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;

      if (select) {
        console.log('✅ Found .goog-te-combo, changing to:', lang.code);

        // Method 1: Set value and trigger events
        select.value = lang.code;
        select.dispatchEvent(new Event('change', { bubbles: true }));

        // Method 2: Try native click on the option
        const option = Array.from(select.options).find(opt => opt.value === lang.code);
        if (option) {
          option.selected = true;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Method 3: Trigger with specific event constructor
        try {
          const changeEvent = document.createEvent('HTMLEvents');
          changeEvent.initEvent('change', true, true);
          select.dispatchEvent(changeEvent);
        } catch (e) {
          // Silently fail on old-style event
        }

        console.log('Language change triggered for:', lang.code);
      } else if (attempts < maxAttempts) {
        // Still trying, no need to log every attempt
        if (attempts > 10) {
          console.log(`⏳ Waiting for Google Translate... (${attempts + 1}/${maxAttempts})`);
        }
        setTimeout(() => tryChangeLanguage(attempts + 1), 300);
      } else {
        // Only warn, not error - this can happen during rapid language switching
        console.warn('⚠️ Google Translate select not available after', maxAttempts, 'attempts. The widget may be reloading.');
      }
    };

    // Give Google Translate a moment to initialize
    setTimeout(() => tryChangeLanguage(), 500);
  };

  return (
    <div className="relative">
      {/* Hidden Google Translate element - ONLY render once to avoid duplicate IDs */}
      {!inHeader && <div id="google_translate_element" className="fixed -top-9999 left-0 h-0 w-0 overflow-hidden pointer-events-none opacity-0" />}

      {/* Global CSS to hide Google's default UI elements */}
      {!inHeader && (
        <style dangerouslySetInnerHTML={{
          __html: `
            body { top: 0 !important; position: static !important; }
            .goog-te-banner-frame, .goog-te-menu-frame, .goog-te-balloon-frame { display: none !important; }
            .goog-te-gadget { font-size: 0 !important; color: transparent !important; }
            #google_translate_element { display: none !important; }
            .skiptranslate { display: none !important; }
            #goog-gt- { display: none !important; }
          `}} />
      )}

      {/* Custom Language Selector */}
      {!hideUI && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200 text-xs font-bold uppercase tracking-wide",
              textColor ? textColor : (inHeader ? 'text-white hover:text-yellow-400 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100')
            )}
            style={inHeader && !textColor ? { textShadow: '0 2px 4px rgba(0,0,0,0.8)' } : {}}
            aria-label="Seleccionar idioma"
          >
            <span className="text-base">{currentLang.flag}</span>
            <span className="hidden sm:inline">{currentLang.code.toUpperCase()}</span>
            <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <>
              {/* Overlay to close dropdown */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />

              {/* Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang)}
                    className={`
                      w-full px-4 py-2.5 text-left flex items-center gap-3
                      transition-colors duration-150
                      ${currentLang.code === lang.code
                        ? 'bg-amber-50 text-amber-900 font-bold'
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm font-medium">{lang.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
