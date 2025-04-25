import { TestBed } from '@angular/core/testing';

import { ActionLogServicesService } from './action-log-services.service';

describe('ActionLogServicesService', () => {
  let service: ActionLogServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionLogServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
