"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useI18n as useI18nCore, type Locale } from "./useI18n";

export { type Locale };

type I18nContextValue = {
  t: (key: string, vars?: Record<string, unknown>) => string;
  locale: Locale;
  setLocale: (l: Locale) => void;
  locales: Locale[];
  mounted: boolean;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const value = useI18nCore();

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}
