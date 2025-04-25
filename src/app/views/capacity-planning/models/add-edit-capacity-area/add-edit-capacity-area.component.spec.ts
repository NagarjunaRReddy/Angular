import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCapacityAreaComponent } from './add-edit-capacity-area.component';

describe('AddEditCapacityAreaComponent', () => {
  let component: AddEditCapacityAreaComponent;
  let fixture: ComponentFixture<AddEditCapacityAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditCapacityAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditCapacityAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
