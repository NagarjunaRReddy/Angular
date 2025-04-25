import { TestBed } from '@angular/core/testing';

import { ProductionPlanningService } from './production-planning.service';

describe('ProductionPlanningService', () => {
  let service: ProductionPlanningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionPlanningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
