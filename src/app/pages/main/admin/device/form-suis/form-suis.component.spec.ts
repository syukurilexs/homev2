import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSuisComponent } from './form-suis.component';

describe('FormSuisComponent', () => {
  let component: FormSuisComponent;
  let fixture: ComponentFixture<FormSuisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSuisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormSuisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
