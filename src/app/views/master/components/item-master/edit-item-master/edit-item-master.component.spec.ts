import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditItemMasterComponent } from './edit-item-master.component';

describe('EditItemMasterComponent', () => {
  let component: EditItemMasterComponent;
  let fixture: ComponentFixture<EditItemMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditItemMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditItemMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
