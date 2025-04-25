import { TestBed } from '@angular/core/testing';

import { LoginConfigurationServicesService } from './login-configuration-services.service';

describe('LoginConfigurationServicesService', () => {
  let service: LoginConfigurationServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginConfigurationServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
