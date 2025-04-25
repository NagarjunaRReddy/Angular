import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditGenericActionComponent } from './add-edit-generic-action.component';

describe('AddEditGenericActionComponent', () => {
  let component: AddEditGenericActionComponent;
  let fixture: ComponentFixture<AddEditGenericActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditGenericActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditGenericActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
