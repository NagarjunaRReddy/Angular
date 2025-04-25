import { TestBed } from '@angular/core/testing';

import { TablesettingService } from './tablesetting.service';

describe('TablesettingService', () => {
  let service: TablesettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TablesettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
