import { TestBed } from '@angular/core/testing';

import { UpwInventoryService } from './upw-inventory.service';

describe('UpwInventoryService', () => {
  let service: UpwInventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpwInventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
