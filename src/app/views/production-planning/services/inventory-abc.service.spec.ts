import { TestBed } from '@angular/core/testing';

import { InventoryAbcService } from './inventory-abc.service';

describe('InventoryAbcService', () => {
  let service: InventoryAbcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryAbcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
