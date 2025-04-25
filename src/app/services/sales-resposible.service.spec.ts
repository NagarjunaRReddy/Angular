import { TestBed } from '@angular/core/testing';

import { SalesResposibleService } from './sales-resposible.service';

describe('SalesResposibleService', () => {
  let service: SalesResposibleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesResposibleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
