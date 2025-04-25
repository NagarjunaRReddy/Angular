import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSlotsComponent } from './add-edit-slots.component';

describe('AddEditSlotsComponent', () => {
  let component: AddEditSlotsComponent;
  let fixture: ComponentFixture<AddEditSlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditSlotsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
