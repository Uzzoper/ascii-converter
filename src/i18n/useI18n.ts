import { useState, useCallback, useEffect } from "react";
import en from "./locales/en.json";
import ptBR from "./locales/pt-BR.json";
import es from "./locales/es.json";

export type Locale = "en" | "pt-BR" | "es";

type Translations = Record<string, string>;

const LOCALES: Locale[] = ["en", "pt-BR", "es"];

const TRANSLATIONS: Record<Locale, Translations> = {
  "en": en,
  "pt-BR": ptBR,
  "es": es,
};

function detectLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem("locale");
  if (saved && LOCALES.includes(saved as Locale)) return saved as Locale;
  if (navigator.language.startsWith("pt")) return "pt-BR";
  if (navigator.language.startsWith("es")) return "es";
  return "en";
}

function interpolate(template: string, vars: Record<string, unknown>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`
  );
}

export function useI18n() {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocaleState(detectLocale());
    setMounted(true);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", l);
    }
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, unknown>): string => {
      const template = TRANSLATIONS[locale]?.[key] ?? TRANSLATIONS["en"]?.[key] ?? key;
      return vars ? interpolate(template, vars) : template;
    },
    [locale]
  );

  return { t, locale, setLocale, locales: LOCALES, mounted };
}
