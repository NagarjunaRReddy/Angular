import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginConfigurationServicesService } from '../../../services/login-configuration-services.service';
import { lastValueFrom, Subject, Subscription, takeUntil } from 'rxjs';
import { BaseService } from '../../../base/base.service';
import { ThemesettingsService } from '../../../services/themesettings.service';
import { TablesettingService } from '../../../services/tablesetting.service';
import { HelperService } from '../../../services/helper.service';
import { ThemeService } from '../../../services/theme.service';
import { Ilogin } from '../../../interfaces/ilogin';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { LoginService } from '../../services/login.service';
import { RolePermissionLeftMenuEntity } from '../../../interfaces/role-entity';
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  unsubscribe$ = new Subject<void>();
  loginConfig: any = {};
  attachmentURL: any = '';
  justifyContent: number = 3;
  isLoading: boolean = true;
  themeConfig: any = {};
  backgroundImage: string = '';
  subscribedService: Subscription[] = [];
  loginInfo: any;
  mainMenuDetails: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private themeService: ThemesettingsService,
    private tService: ThemeService,
    private loginConfigService: LoginConfigurationServicesService,
    private tablesettingService: TablesettingService,
    public base: BaseService,
    public helper: HelperService,
    private toastr: ToastrService,
    private authGuardService: AuthService,
    private login: LoginService,
    private roleService: RoleService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getLoginConfiguration();
    this.attachmentURL = this.base.iconUrl;
  }

  getLoginConfiguration() {
    let data = {
      tenantId: 1,
    };

    this.loginConfigService
      .SelectLoginConfigurations(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.backgroundImage =
            this.attachmentURL + response[0].BackgroundImage;
          this.loginConfig = response[0];
          this.justifyContent = response[0].FormAlignment;
        },
        error: (error: Error) => {
          this.isLoading = false;
        },
      });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.toastr.error('Enter Valid Credentials', 'ERROR');
      return;
    }
    const loginData: Ilogin = {
      EmailId: this.loginForm.controls['username'].value,
      Password: this.loginForm.controls['password'].value,
    };

    const loginService = this.login.loginUser(loginData).subscribe(
      async (res: any) => {
        if (res != null) {
          this.helper.setValue('isLoggedIn', true);
          this.authGuardService.isLoggedIn = true;
          this.helper.setValue('LoginInfo', res[0]);
          await this.getLeftMenuData();
          this.SetToken(res[0].authKey);
          this.helper.setBusinessRole(res[0]);
          this.setUserName(res[0].FirstName);
          this.getThemeSettings();
          this.getTableSettings();
        } else {
          this.toastr.error('Invalid Username or Password');
        }
      },
      (error: Error) => {
        this.toastr.error('Some Error Occurred', 'ERROR');
      }
    );
    this.subscribedService.push(loginService);
    //this.getThemeSettings();
    //this.getTableSettings();
  }

  SetToken(token) {
    sessionStorage.setItem('authKey', token);
  }
  getToken() {
    return sessionStorage.getItem('authKey');
  }
  setUserName(FirstName) {
    sessionStorage.setItem('FirstName', FirstName);
  }
  getUserName() {
    return sessionStorage.getItem('FirstName');
  }

  getTableSettings() {
    let data = {
      tenantId: 4,
      roleId: 4,
    };

    this.tablesettingService
      .getTableSettingConfiguration(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          this.helper.setValue('tableSettings', response[0]);
        },
        error: (err: any) => {},
      });
  }

  getThemeSettings() {
    let data = {
      tenantId: 4,
      roleId: 4,
    };

    this.themeService
      .getColorThemeSettingConfiguration(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          this.helper.setValue('themeSettings', response);

          this.router.navigateByUrl('main');
          this.themeConfig = response[0];
          this.tService.saveTheme({
            primary: this.themeConfig.PrimaryBackgroundColour,
            secondary: this.themeConfig.SecondaryBackgroundColour,
            text: this.themeConfig.PrimaryTextColour,
            hover: this.themeConfig.OnHoverColour,
          });
          // document.documentElement.style.setProperty(
          //   '--primary-color',
          //   `${this.themeConfig.PrimaryBackgroundColour}`
          // );
          // document.documentElement.style.setProperty(
          //   '--secondary-color',
          //   `${this.themeConfig.SecondaryBackgroundColour}`
          // );
          // document.documentElement.style.setProperty(
          //   '--hover-color',
          //   `${this.themeConfig.OnHoverColour}`
          // );
          // document.documentElement.style.setProperty(
          //   '--primary-text-color',
          //   `${this.themeConfig.PrimaryTextColour}`
          // );
        },
        error: (err: any) => {},
      });
  }

  getJustifyContent(justifyContent: any): string {
    switch (justifyContent) {
      case 0:
        return 'flex-start';
      case 1:
        return 'center';
      case 2:
        return 'flex-end';
      default:
        return 'flex-start'; // default value
    }
  }

  ngOnDestroy(): void {
    // Clean up the subscription when the component is destroyed
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async getLeftMenuData(): Promise<void> {
    try {
      this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));

      const roleData: RolePermissionLeftMenuEntity = {
        RoleId: this.loginInfo.RoleId || 0,
      };

      const res = await lastValueFrom(
        this.roleService.RolePermissionLeftMenu(roleData)
      );
      console.log(res);

      this.mainMenuDetails = res;
      this.helper.setValue('leftMenu', res);

      const routeMenu = this.mainMenuDetails.filter(
        (menu: any) => menu.ReadAccess
      );
      console.log(routeMenu);

      if (routeMenu.length > 0) {
        console.log("if");
        
        this.router.navigate([`main/${routeMenu[0].MenuPath}`]);
      } else {
        this.router.navigateByUrl('/invalid-route');
        console.log("else");
      }
    } catch (err) {
      this.toastr.error('Some Error Occurred', 'ERROR');
      console.error(err);
    }
  }
}
