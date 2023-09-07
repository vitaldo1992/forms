import {ValidatorFn} from "@angular/forms";

export interface ValidatorsDictionary {
  [lang: string]: ValidatorFn[];
}
