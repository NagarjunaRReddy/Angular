import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemesettingsService {

  constructor( private base:BaseService) { }

  getThemeSettingConfiguration(themeSettings: any) {
    return this.base.post('ThemeSetting/SelectThemeConfigurations', themeSettings).pipe(map((response: any) => {
      return response;
    }));
  }

  getColorThemeSettingConfiguration(themeSettings: any) {
    return this.base.post('ColorThemeSetting/SelectColorThemeSettings', themeSettings).pipe(map((response: any) => {
      return response;
    }));
  }

  InsertOrUpdateThemeSettingConfiguration(themeSettings: any) {
    return this.base.post('ThemeSetting/InsertOrUpdateThemeConfigurations', themeSettings).pipe(map((response: any) => {
      return response;
    }));
  }

  InsertOrUpdateColorThemeSettingConfiguration(themeSettings: any) {
    return this.base.post('ColorThemeSetting/InsertOrUpdateColorThemeSettings', themeSettings).pipe(map((response: any) => {
      return response;
    }));
  }
}
