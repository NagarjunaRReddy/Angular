import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckstatusComponent } from './truckstatus.component';

describe('TruckstatusComponent', () => {
  let component: TruckstatusComponent;
  let fixture: ComponentFixture<TruckstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TruckstatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TruckstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
