import { TestBed } from '@angular/core/testing';

import { StepChangedService } from './step-changed.service';

describe('StepChangedService', () => {
  let service: StepChangedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StepChangedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
