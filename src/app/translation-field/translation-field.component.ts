import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
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
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule, ValidationErrors, Validator, Validators
} from "@angular/forms";

import {TranslationMap} from "./translation.interface";
import {ToTranslationsArrayPipe} from "./to-translations-array.pipe";
import {Appearance} from "./appearance.interface";
import {map, startWith, Subject, takeUntil} from "rxjs";
import {ValidatorsDictionary} from "./validators.interface";
import {ExtractErrorsPipe} from "./extract-errors.pipe";
import {ErrorsDictionary} from "./errors-dictionary.interface";
import {TextFieldModule} from "@angular/cdk/text-field";
import {MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-translation-field',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, BrowserAnimationsModule, NgForOf, ToTranslationsArrayPipe, ReactiveFormsModule, ExtractErrorsPipe, TextFieldModule, MatButtonModule, MatInputModule, MatIconModule],
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
      useExisting: forwardRef(() => TranslationFieldComponent),
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

  private saveChanges$ = new Subject();
  private destroyed$ = new Subject<void>();

  formErrors$ = this.localForm.valueChanges.pipe(
    startWith(this.localForm.value),
    map((value) => {
      const errorsDictionary: ErrorsDictionary = {};
      if (value) {
        Object.keys(this.localForm.controls).find(controlName => {
          const errors = this.localForm.get(controlName)?.errors;
          if (errors) {
            errorsDictionary[controlName] = errors;
          }
          return !!errors;
        });
      }
      return errorsDictionary;
    }));

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

  @Input() validators: ValidatorsDictionary = {
    en: [Validators.required],
    cz: [Validators.required],
    sk: [Validators.required]
  }

  @ViewChild(TemplateRef) dialogTemplate?: TemplateRef<void>;
  private dialogRef?: MatDialogRef<void>;

  constructor(readonly dialog: MatDialog) {
  }

  writeValue(value: TranslationMap) {
    if (value) {
      this._initialValue = value;
      Object.entries(value).forEach(([lang, value]) => this.localForm.addControl(lang, new FormControl(value,
          this.validators[lang]
        ))
      );
    }
  }

  registerOnChange(fn: any): void {
    this.saveChanges$.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
  }

  validateForm(form: FormGroup) {
    if (form.valid) {
      this.saveChanges$.next(form.value);
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
    if (Object.values(value).filter(translation => !translation).length) {
      return {
        missingTranslation: true
      }
    }
    return null;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
