"use client";

import { useEffect, useTransition, useRef } from "react";
import { useI18nStore } from "@/stores/useI18nStore";

export function useTranslation(namespaces: string[] = ["common"]) {
  const locale = useI18nStore((s) => s.locale);
  const t = useI18nStore((s) => s.t);
  const loadNamespace = useI18nStore((s) => s.loadNamespace);
  const changeLocale = useI18nStore((s) => s.changeLocale);
  const [, startTransition] = useTransition();

  const prevNamespacesKeyRef = useRef<string>("");
  const prevLocaleRef = useRef<string>("");

  useEffect(() => {
    const sortedKey = [...namespaces].sort().join(",");
    if (prevNamespacesKeyRef.current === sortedKey && prevLocaleRef.current === locale) {
      return;
    }
    prevNamespacesKeyRef.current = sortedKey;
    prevLocaleRef.current = locale;

    namespaces.forEach((ns) => {
      startTransition(() => {
        loadNamespace(ns);
      });
    });
  }, [namespaces, locale, loadNamespace]);

  return { t, locale, changeLocale };
}
