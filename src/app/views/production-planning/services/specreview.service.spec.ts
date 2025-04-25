import { TestBed } from '@angular/core/testing';

import { SpecreviewService } from './specreview.service';

describe('SpecreviewService', () => {
  let service: SpecreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
