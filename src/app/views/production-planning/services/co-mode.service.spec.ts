import { TestBed } from '@angular/core/testing';

import { CoModeService } from './co-mode.service';

describe('CoModeService', () => {
  let service: CoModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
