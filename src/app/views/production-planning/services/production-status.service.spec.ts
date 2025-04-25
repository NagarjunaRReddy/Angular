import { TestBed } from '@angular/core/testing';

import { ProductionStatusService } from './production-status.service';

describe('ProductionStatusService', () => {
  let service: ProductionStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
