import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AxProductionPlanningComponent } from './ax-production-planning.component';

describe('AxProductionPlanningComponent', () => {
  let component: AxProductionPlanningComponent;
  let fixture: ComponentFixture<AxProductionPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AxProductionPlanningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AxProductionPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
