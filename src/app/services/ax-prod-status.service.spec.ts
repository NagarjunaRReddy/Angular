import { TestBed } from '@angular/core/testing';

import { AxProdStatusService } from './ax-prod-status.service';

describe('AxProdStatusService', () => {
  let service: AxProdStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AxProdStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
