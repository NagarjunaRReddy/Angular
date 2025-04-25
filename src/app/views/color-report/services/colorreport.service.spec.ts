import { TestBed } from '@angular/core/testing';

import { ColorreportService } from './colorreport.service';

describe('ColorreportService', () => {
  let service: ColorreportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorreportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
