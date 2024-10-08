import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActuatorComponent } from './actuator.component';

describe('ActuatorComponent', () => {
  let component: ActuatorComponent;
  let fixture: ComponentFixture<ActuatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActuatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActuatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
