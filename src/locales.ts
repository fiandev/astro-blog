import id from "../locales/id.json";
import en from "../locales/en.json";

export const locales = { id, en };
export const createTranslator =
  (lang: keyof typeof locales) => (key: keyof typeof id) =>
    locales[lang]?.[key] ?? key;
