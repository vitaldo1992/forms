import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ValidatorsDictionary} from "./translation-field/validators.interface";
import {hasCyrillicValidator} from "./has-cyrillic.valitator";
import {Appearance} from "./translation-field/appearance.interface";
import {TranslationMap} from "./translation-field/translation.interface";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'translate-dialog';

  appearance: Appearance = {
    en: {
      label: 'English',
      hint: `Copy cyrillic letters 'Я и некоторые буквы' to test custom validator`
    },
    cz: {
      label: 'Čeština'
    },
    sk: {
      label: 'Slovák'
    }
  }

  validators: ValidatorsDictionary = {
    en: [
      Validators.required,
      hasCyrillicValidator(`Translation shouldn't have Cyrillic letters`)
    ]
  }

  statusText: TranslationMap = {
    en: 'You are a top-level customer',
    cz: 'Jste zákazník na nejvyšší úrovni',
    sk: 'Ste zákazník na najvyššej úrovni'
  }

  form = new FormGroup({
    senderEmail: new FormControl('vitaliy.duvalko@gmail.com', [Validators.required, Validators.email]),
    welcomeMessage: new FormControl({
        en: 'Welcome to our community!',
        cz: 'Vítejte v naší komunitě!',
        sk: 'Vitajte v našej komunite!'
      },
    ),
    introText: new FormControl({
      en: 'This is an intro text placeholder....',
      cz: 'Toto je zástupný symbol úvodního textu....',
      sk: 'Toto je zástupný symbol úvodného textu....'
    }),
    successText: new FormControl({
      en: '',
      cz: '',
      sk: ''
    })
  });

  constructor(private cdr: ChangeDetectorRef) {
    this.form.valueChanges.subscribe((value) => {
      // TODO unsubscribe and handle view update without cdr
      console.log(this.form.get('successText'));
      this.cdr.detectChanges();
    })
  }

  submitForm() {
    console.log(this.form)
  }
}
