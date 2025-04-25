import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBusinessUnitComponent } from './add-edit-business-unit.component';

describe('AddEditBusinessUnitComponent', () => {
  let component: AddEditBusinessUnitComponent;
  let fixture: ComponentFixture<AddEditBusinessUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditBusinessUnitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditBusinessUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
