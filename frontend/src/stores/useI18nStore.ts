import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { cookieStorage } from "@/shared/utils/cookieStorage";
import {
  formatTemplate,
  getNestedValue,
  LocaleType,
  TranslationParams,
} from "@/shared/i18n/translate";

export interface I18nState {
  locale: LocaleType;
  messages: Record<string, Record<string, unknown>>; // key: namespace, val: dict
  loadedNamespaces: string[];
  setLocale: (locale: LocaleType) => void;
  loadNamespace: (ns: string) => Promise<void>;
  changeLocale: (locale: LocaleType) => Promise<void>;
  t: (key: string, paramsOrFallback?: TranslationParams | string, fallback?: string) => string;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      locale: "th",
      messages: {},
      loadedNamespaces: [],

      setLocale: (locale) => set({ locale }),

      loadNamespace: async (ns: string) => {
        const { locale, messages, loadedNamespaces } = get();
        if (messages[ns]) return; // already loaded for this session

        try {
          const mod = await import(`@/locales/${locale}/${ns}.json`);
          set((s) => ({
            messages: { ...s.messages, [ns]: mod.default || mod },
            loadedNamespaces: Array.from(new Set([...s.loadedNamespaces, ns])),
          }));
        } catch (err) {
          console.warn(`[i18n] Failed to load namespace "${ns}" for locale "${locale}":`, err);
        }
      },

      changeLocale: async (newLocale: LocaleType) => {
        const { loadedNamespaces } = get();
        set({ locale: newLocale, messages: {} });

        // Reload all previously loaded namespaces in new locale
        const reloaded: Record<string, Record<string, unknown>> = {};
        for (const ns of loadedNamespaces) {
          try {
            const mod = await import(`@/locales/${newLocale}/${ns}.json`);
            reloaded[ns] = mod.default || mod;
          } catch (e) {
            console.warn(`[i18n] Failed reloading "${ns}" for locale "${newLocale}":`, e);
          }
        }
        set({ messages: reloaded });
      },

      t: (key: string, paramsOrFallback?: TranslationParams | string, fallback?: string): string => {
        const { messages } = get();
        let params: TranslationParams | undefined;
        let defaultVal: string = "";

        if (typeof paramsOrFallback === "string") {
          defaultVal = paramsOrFallback;
        } else if (paramsOrFallback && typeof paramsOrFallback === "object") {
          params = paramsOrFallback;
          if (typeof fallback === "string") {
            defaultVal = fallback;
          }
        }

        // key: "auth.login.title" or "common.save"
        const dotIndex = key.indexOf(".");
        if (dotIndex === -1) {
          return defaultVal || key;
        }

        const ns = key.substring(0, dotIndex);
        const subPath = key.substring(dotIndex + 1);

        const nsMessages = messages[ns];
        if (!nsMessages) {
          return defaultVal || key;
        }

        const rawText = getNestedValue(nsMessages, subPath);
        if (!rawText) {
          return defaultVal || key;
        }

        return formatTemplate(rawText, params);
      },
    }),
    {
      name: "i18n-storage",
      partialize: (s) => ({ locale: s.locale }),
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);
