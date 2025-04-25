import { TestBed } from '@angular/core/testing';

import { AttachmentStatusService } from './attachment-status.service';

describe('AttachmentStatusService', () => {
  let service: AttachmentStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttachmentStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
