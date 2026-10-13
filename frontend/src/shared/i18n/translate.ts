export type LocaleType = "th" | "en";

export interface TranslationParams {
  [key: string]: string | number;
}

// Simple placeholder replacer: "Welcome {{name}}" -> "Welcome สมชาย"
export function formatTemplate(
  template: string,
  params?: TranslationParams
): string {
  if (!params) return template;
  return Object.keys(params).reduce((acc, key) => {
    return acc.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), String(params[key]));
  }, template);
}

// Deep get helper: "auth.login.title"
export function getNestedValue(
  obj: Record<string, unknown>,
  path: string
): string | undefined {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof current === "string" ? current : undefined;
}
