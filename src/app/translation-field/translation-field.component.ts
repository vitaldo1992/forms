import {
  ChangeDetectionStrategy,
  Component,
  forwardRef, Injector,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {CommonModule, NgForOf} from '@angular/common';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule, NG_VALIDATORS,
  NG_VALUE_ACCESSOR, NgControl,
  ReactiveFormsModule, ValidationErrors, Validator
} from "@angular/forms";

import {TranslationMap} from "./translation.interface";
import {ToTranslationsArrayPipe} from "./to-translations-array.pipe";
import {Appearance} from "./appearance.interface";
import {Subject, takeUntil} from "rxjs";
import {TextFieldModule} from "@angular/cdk/text-field";
import {MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {ParseErrorsPipe} from "./parse-errors.pipe";

@Component({
  selector: 'app-translation-field',
  standalone: true,
  imports: [ParseErrorsPipe, CommonModule, FormsModule, MatDialogModule, BrowserAnimationsModule, NgForOf, ToTranslationsArrayPipe, ReactiveFormsModule, TextFieldModule, MatButtonModule, MatInputModule, MatIconModule],
  templateUrl: './translation-field.component.html',
  styleUrls: ['./translation-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TranslationFieldComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useClass: forwardRef(() => TranslationFieldComponent),
      multi: true
    }]
})
export class TranslationFieldComponent implements ControlValueAccessor, Validator, OnDestroy {

  translations: TranslationMap = {
    en: '',
    cz: '',
    sk: ''
  };

  private _initialValue = {...this.translations};

  localForm = new FormGroup({}, {updateOn: 'submit'});
  control?: NgControl;

  private saveChanges$ = new Subject();
  private destroyed$ = new Subject<void>();

  _appearance: Appearance = {
    en: {
      label: 'English'
    },
    cz: {
      label: 'Czech'
    },
    sk: {
      label: 'Slovak'
    }
  }

  @Input() name: string = '';
  @Input() title: string = 'Edit translation';

  @Input() set appearance(value: Appearance) {
    this._appearance = {
      ...this._appearance,
      ...value
    };
  }

  @ViewChild(TemplateRef) dialogTemplate?: TemplateRef<void>;
  private dialogRef?: MatDialogRef<void>;

  constructor(
    readonly dialog: MatDialog,
    private _injector: Injector,

  ) {}

  ngOnInit() {
    /* temp solution to get control and avoid DI error */
    this.control = this._injector.get(NgControl);
  }

  writeValue(value: TranslationMap) {
    if (value) {
      this._initialValue = value;
      Object.entries(value).forEach(([lang, value]) => this.localForm.addControl(lang, new FormControl(value)));
    }
  }

  registerOnChange(fn: any): void {
    this.saveChanges$.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
  }

  submitForm() {
    if (this.control?.control?.validator) {
      this.localForm.addValidators(this.control.control.validator);
      this.localForm.updateValueAndValidity();
    }
    if (this.localForm.valid) {
      this.saveChanges$.next(this.localForm.value);
      this.dialogRef?.close();
    }
  }

  openDialog(): void {
    if (this.dialogTemplate) {
      this.dialogRef = this.dialog.open(this.dialogTemplate, {
        hasBackdrop: true,
        minWidth: 400
      });
      this.dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(() => {
        if (this.localForm.invalid) this.localForm.reset(this._initialValue);
      })
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    const missingTranslation = Object.entries(value).find(([, value]) => !value);
    if (missingTranslation) {
      const lang = missingTranslation[0];
      return {
        [lang]: `Missing translation error`
      }
    }
    return null;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
