import { TestBed } from '@angular/core/testing';

import { BigPartsService } from './big-parts.service';

describe('BigPartsService', () => {
  let service: BigPartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BigPartsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
