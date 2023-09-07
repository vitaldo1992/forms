import {ValidationErrors} from "@angular/forms";

export interface ErrorsDictionary {
  [lang: string]: ValidationErrors | null;
}
