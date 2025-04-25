import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProductionPlanningCardViewComponent } from './add-edit-production-planning-card-view.component';

describe('AddEditProductionPlanningCardViewComponent', () => {
  let component: AddEditProductionPlanningCardViewComponent;
  let fixture: ComponentFixture<AddEditProductionPlanningCardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditProductionPlanningCardViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditProductionPlanningCardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
