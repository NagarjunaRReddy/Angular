import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDealerTableComponent } from './add-edit-dealer-table.component';

describe('AddEditDealerTableComponent', () => {
  let component: AddEditDealerTableComponent;
  let fixture: ComponentFixture<AddEditDealerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditDealerTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditDealerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
