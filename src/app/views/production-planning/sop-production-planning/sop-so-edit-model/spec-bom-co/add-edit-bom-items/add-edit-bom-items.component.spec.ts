import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBomItemsComponent } from './add-edit-bom-items.component';

describe('AddEditBomItemsComponent', () => {
  let component: AddEditBomItemsComponent;
  let fixture: ComponentFixture<AddEditBomItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditBomItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditBomItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
