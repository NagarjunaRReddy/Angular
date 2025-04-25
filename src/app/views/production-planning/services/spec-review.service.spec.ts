import { TestBed } from '@angular/core/testing';

import { SpecReviewService } from './spec-review.service';

describe('SpecReviewService', () => {
  let service: SpecReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
