import { TestBed } from '@angular/core/testing';

import { ProductionPoolService } from './production-pool.service';

describe('ProductionPoolService', () => {
  let service: ProductionPoolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionPoolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
