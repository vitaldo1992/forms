export interface TranslationDictionary<T> {
  en: T;
  cz: T;
  sk: T;
  [lang: string]: T; // For adding other languages
}
