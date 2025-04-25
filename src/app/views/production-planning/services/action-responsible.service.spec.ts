import { TestBed } from '@angular/core/testing';

import { ActionResponsibleService } from './action-responsible.service';

describe('ActionResponsibleService', () => {
  let service: ActionResponsibleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionResponsibleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
