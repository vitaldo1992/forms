import {TranslationDictionary} from "./translation-dictionary.interface";

export interface TranslationMap extends TranslationDictionary<string> {}

export interface Translation {
  name: string;
  translations: TranslationMap;
}

export interface Translations extends Array<{
  lang: string;
  value: string;
}> {}
