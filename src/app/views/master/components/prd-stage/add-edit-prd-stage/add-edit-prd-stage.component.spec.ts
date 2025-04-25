import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPrdStageComponent } from './add-edit-prd-stage.component';

describe('AddEditPrdStageComponent', () => {
  let component: AddEditPrdStageComponent;
  let fixture: ComponentFixture<AddEditPrdStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditPrdStageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditPrdStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
