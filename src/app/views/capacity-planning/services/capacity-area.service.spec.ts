import { TestBed } from '@angular/core/testing';

import { CapacityAreaService } from './capacity-area.service';

describe('CapacityAreaService', () => {
  let service: CapacityAreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CapacityAreaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
