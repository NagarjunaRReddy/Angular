import { TestBed } from '@angular/core/testing';

import { DecalsService } from './decals.service';

describe('DecalsService', () => {
  let service: DecalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
