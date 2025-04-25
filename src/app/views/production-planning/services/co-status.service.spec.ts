import { TestBed } from '@angular/core/testing';

import { CoStatusService } from './co-status.service';

describe('CoStatusService', () => {
  let service: CoStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
