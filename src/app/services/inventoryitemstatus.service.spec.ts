import { TestBed } from '@angular/core/testing';

import { InventoryitemstatusService } from './inventoryitemstatus.service';

describe('InventoryitemstatusService', () => {
  let service: InventoryitemstatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryitemstatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
