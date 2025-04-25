import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SopProductionPlanningComponent } from './sop-production-planning.component';

describe('SopProductionPlanningComponent', () => {
  let component: SopProductionPlanningComponent;
  let fixture: ComponentFixture<SopProductionPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SopProductionPlanningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SopProductionPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
