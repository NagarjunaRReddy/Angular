import { TestBed } from '@angular/core/testing';

import { DrawingStatusService } from './drawing-status.service';

describe('DrawingStatusService', () => {
  let service: DrawingStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawingStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
