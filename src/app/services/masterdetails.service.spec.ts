import { TestBed } from '@angular/core/testing';

import { MasterdetailsService } from './masterdetails.service';

describe('MasterdetailsService', () => {
  let service: MasterdetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterdetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
