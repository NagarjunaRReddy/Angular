import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDecalsComponent } from './add-edit-decals.component';

describe('AddEditDecalsComponent', () => {
  let component: AddEditDecalsComponent;
  let fixture: ComponentFixture<AddEditDecalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditDecalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditDecalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
