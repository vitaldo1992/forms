import {Pipe, PipeTransform} from "@angular/core";
import {TranslationMap, Translations} from "./translation.interface";

@Pipe({
  name: 'toTranslationArray',
  standalone: true
})
export class ToTranslationsArrayPipe implements PipeTransform {

  transform(value: TranslationMap): Translations {
    return Object.entries(value).map( ([lang, value]) => ({
      lang,
      value
    }));
  }
}
