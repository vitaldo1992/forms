import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationFieldComponent } from './translation-field.component';

describe('TranslationFieldComponent', () => {
  let component: TranslationFieldComponent;
  let fixture: ComponentFixture<TranslationFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TranslationFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranslationFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
