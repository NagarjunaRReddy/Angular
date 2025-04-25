import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionPlanningCardViewComponent } from './production-planning-card-view.component';

describe('ProductionPlanningCardViewComponent', () => {
  let component: ProductionPlanningCardViewComponent;
  let fixture: ComponentFixture<ProductionPlanningCardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductionPlanningCardViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionPlanningCardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
