import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function hasCyrillicValidator(message: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const en = value['en'];

    const hasCyrillic = en?.match(/\p{sc=Cyrillic}/u);

    return hasCyrillic ? { hasCyrillic: { message: `EN: ${message}` } } : null;
  }
}
