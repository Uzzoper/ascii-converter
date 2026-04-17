"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { type Locale, useI18n } from "@/i18n/I18nProvider";

export default function LanguageToggle() {
  const { locale, setLocale, locales, mounted } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const labels: Record<Locale, string> = {
    "en": "en",
    "pt-BR": "pt-BR",
    "es": "es"
  };

  if (!mounted) return null;

  return (
    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center justify-center font-mono text-[10px] sm:text-xs z-50">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 border rounded-md sm:rounded-lg transition-all duration-200 ${
            isOpen 
              ? "border-accent text-accent bg-accent/10" 
              : "border-border-subtle text-foreground hover:border-accent hover:text-accent"
          }`}
          aria-label="Select language"
        >
          <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>{labels[locale]}</span>
          <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 sm:mt-2 w-full min-w-[80px] sm:min-w-[100px] flex flex-col bg-surface border border-border-subtle rounded-md sm:rounded-lg overflow-hidden animate-[fadeIn_0.15s_ease-out] shadow-xl">
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLocale(l);
                  setIsOpen(false);
                }}
                className={`px-2 py-1.5 sm:px-3 sm:py-2 text-left transition-colors ${
                  locale === l 
                    ? "bg-accent/10 text-accent font-bold border-l-2 border-accent" 
                    : "text-foreground hover:bg-white/5 hover:text-accent border-l-2 border-transparent"
                }`}
              >
                {labels[l]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
