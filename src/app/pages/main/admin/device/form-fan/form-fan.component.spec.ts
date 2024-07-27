import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFanComponent } from './form-fan.component';

describe('FormFanComponent', () => {
  let component: FormFanComponent;
  let fixture: ComponentFixture<FormFanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
