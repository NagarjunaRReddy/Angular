import { TestBed } from '@angular/core/testing';

import { InventoryItemStatusService } from './inventory-item-status.service';

describe('InventoryItemStatusService', () => {
  let service: InventoryItemStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryItemStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
