import { TestBed } from '@angular/core/testing';

import { NewToastrService } from './new-toastr.service';

describe('NewToastrService', () => {
  let service: NewToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewToastrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
