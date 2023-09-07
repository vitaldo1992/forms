import {Pipe, PipeTransform} from "@angular/core";
import {ValidationErrors} from "@angular/forms";

interface PrettyError {
  lang?: string | undefined;
  message?: string;
}

@Pipe({
  pure: true,
  name: 'parseErrors',
  standalone: true
})
export class ParseErrorsPipe implements PipeTransform {
  transform(errors: ValidationErrors | null): PrettyError {
    if (errors) {
      const error = Object.entries(errors)[0];
      if (error) {
        const [ lang, value ] = error;
        const message = value.message || value as string;
        return { lang, message }
      }
    }
    return {}
  }
}
