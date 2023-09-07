import {Pipe, PipeTransform} from "@angular/core";
import {ErrorsDictionary} from "./errors-dictionary.interface";

@Pipe({
  name: 'extractErrors',
  pure: true,
  standalone: true
})
export class ExtractErrorsPipe implements PipeTransform {

  transform(errors: ErrorsDictionary): string {
    const controlErrors = Object.values(errors)[0];
    if (controlErrors) {
      const isRequired = controlErrors['required'];
      if (isRequired) {
        return `The required translation is missing`;
      }
      return Object.entries(controlErrors).reduce((acc,[, value], index) => {
        return index ? acc : acc + (value['message'] || `Translation doesn't match pattern`);
      }, '');
    }
    return '';
  }
}
