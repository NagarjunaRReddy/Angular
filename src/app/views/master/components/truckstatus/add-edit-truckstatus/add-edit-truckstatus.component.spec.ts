import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTruckstatusComponent } from './add-edit-truckstatus.component';

describe('AddEditTruckstatusComponent', () => {
  let component: AddEditTruckstatusComponent;
  let fixture: ComponentFixture<AddEditTruckstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditTruckstatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditTruckstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
