import { TestBed } from '@angular/core/testing';

import { PrdStageService } from './prd-stage.service';

describe('PrdStageService', () => {
  let service: PrdStageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrdStageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
