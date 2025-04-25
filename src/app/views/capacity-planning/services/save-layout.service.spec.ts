import { TestBed } from '@angular/core/testing';

import { SaveLayoutService } from './save-layout.service';

describe('SaveLayoutService', () => {
  let service: SaveLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
