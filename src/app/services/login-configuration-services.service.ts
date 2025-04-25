import { Injectable } from '@angular/core';
import { LoginConfigurationDto, LoginConfigurationSelect } from '../interfaces/login-configuration-entity';
import { BaseService } from '../base/base.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginConfigurationServicesService {

  constructor(private base: BaseService) { }

  InsertOrUpdateLoginConfiguration(formData: FormData) {
    return this.base.post('LoginConfiguration/InsertOrUpdateLoginConfiguration', formData).pipe(map((response: any) => {
      return response;
    }));
  }
  SelectLoginConfigurations(loginConfigurationSelect: LoginConfigurationSelect) {
    return this.base.post('LoginConfiguration/SelectLoginConfigurations', loginConfigurationSelect).pipe(map((response: any) => {
      return response;
    }));
  }
}
