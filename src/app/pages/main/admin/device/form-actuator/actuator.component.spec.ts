import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpiComponent } from './actuator.component';

describe('RpiComponent', () => {
  let component: RpiComponent;
  let fixture: ComponentFixture<RpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RpiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
