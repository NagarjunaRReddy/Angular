import { TestBed } from '@angular/core/testing';

import { ActionStatusService } from './action-status.service';

describe('ActionStatusService', () => {
  let service: ActionStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
