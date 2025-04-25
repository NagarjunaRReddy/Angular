import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCoModeComponent } from './add-edit-co-mode.component';

describe('AddEditCoModeComponent', () => {
  let component: AddEditCoModeComponent;
  let fixture: ComponentFixture<AddEditCoModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditCoModeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditCoModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
