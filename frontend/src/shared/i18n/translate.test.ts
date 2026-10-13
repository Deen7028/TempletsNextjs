import { describe, it, expect } from "vitest";
import { formatTemplate, getNestedValue } from "@/shared/i18n/translate";

describe("i18n translation helpers", () => {
  it("formats template placeholders correctly", () => {
    const template = "Hello {{name}}, you have {{count}} items.";
    const result = formatTemplate(template, { name: "Antigravity", count: 5 });
    expect(result).toBe("Hello Antigravity, you have 5 items.");
  });

  it("extracts nested values from translation object", () => {
    const data = {
      auth: {
        login: {
          title: "เข้าสู่ระบบ",
        },
      },
    };
    expect(getNestedValue(data, "auth.login.title")).toBe("เข้าสู่ระบบ");
    expect(getNestedValue(data, "auth.missing.key")).toBeUndefined();
  });
});
