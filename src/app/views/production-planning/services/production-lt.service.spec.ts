import { TestBed } from '@angular/core/testing';

import { ProductionLtService } from './production-lt.service';

describe('ProductionLtService', () => {
  let service: ProductionLtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionLtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
