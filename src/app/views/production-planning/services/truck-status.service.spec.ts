import { TestBed } from '@angular/core/testing';

import { TruckStatusService } from './truck-status.service';

describe('TruckStatusService', () => {
  let service: TruckStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TruckStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
