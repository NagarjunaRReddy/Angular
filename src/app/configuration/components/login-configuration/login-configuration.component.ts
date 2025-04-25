import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginConfigurationServicesService } from '../../../services/login-configuration-services.service';
import {
  LoginConfigurationDto,
  LoginConfigurationEntity,
} from '../../../interfaces/login-configuration-entity';
import { Subject, takeUntil } from 'rxjs';
import { BaseService } from '../../../base/base.service';
import { HelperService } from '../../../services/helper.service';

@Component({
  selector: 'app-login-configuration',
  templateUrl: './login-configuration.component.html',
  styleUrl: './login-configuration.component.scss',
})
export class LoginConfigurationComponent implements OnInit {
  configForm!: FormGroup;
  configuratorOpen: boolean = true;
  enableBackgroundImage: boolean = false;
  isLoading:boolean = false;
  backgroundImageURL: string = '';
  logoURL: string = '';

  backgroundImage: File | null = null;
  logoImage: File | null = null;
  loginConfig: any = {};
  unsubscribe$ = new Subject<void>();
  attachmentURL: string = "";
  constructor(
    private fb: FormBuilder,
    public base:BaseService,
    public helper:HelperService,
    private loginConfigService: LoginConfigurationServicesService
  ) {
    this.configForm = this.fb.group({
      backgroundType: ['color'],
      backgroundColor: ['#e5f2ff'],
      backgroundImage: [''],
      loginFormBackgroundColor: ['#ffffff'],
      textColor: ['#000000'],
      buttonBgColor: ['#000000'],
      buttonTextColor: ['#ffffff'],
      alignment: ['center'],
      logoImage: [''],
    });
  }

  ngOnInit(): void {
    // Define the form structure with initial values
    // this.configForm = this.fb.group({
    //   backgroundType:['color'],
    //   backgroundColor: ['#e5f2ff'],
    //   backgroundImage: [''],
    //   loginFormBackgroundColor:['#ffffff'],
    //   textColor: ['#000000'],
    //   buttonBgColor: ['#000000'],
    //   buttonTextColor: ['#ffffff'],
    //   alignment: ['center'],
    //   logoImage: ['']
    // });
    this.attachmentURL = this.base.iconUrl;
    this.getLoginConfiguration();
  }

  // Method to reset form values to default
  resetDefaults(): void {
    this.configForm.setValue({
      backgroundColor: '#ffffff',
      backgroundImage: '',
      textColor: '#000000',
      alignment: 'center',
      logoImage: '',
    });
  }

  toggleConfigurator() {
    this.configuratorOpen = !this.configuratorOpen;
  }

  // Helper to get form values for preview
  get formValues() {
    return this.configForm.value;
  }

  onBackgroundTypeChange() {
    const selectedBackgroundType = this.configForm.get('backgroundType')?.value;
    console.log('Selected background type:', selectedBackgroundType);

    // Perform actions based on the selected type
    if (selectedBackgroundType === 'image') {
      // Handle image-related logic
      this.enableBackgroundImage = true;
    } else if (selectedBackgroundType === 'color') {
      // Handle color-related logic
      this.enableBackgroundImage = false;
    }
  }

  saveData() {
    // console.log(this.formValues);
    if (this.configForm.valid) {
      const formValues = this.configForm.value;

      const LoginConfiguration: LoginConfigurationEntity = {
        backgroundType: formValues.backgroundType === 'image',
        backgroundColor: formValues.backgroundColor,
        formBackgroundColor: formValues.loginFormBackgroundColor,
        textColor: formValues.textColor,
        formAlignment: this.getFormAlignmentValue(formValues.alignment) ?? 0,
        buttonBackgroundColor: formValues.buttonBgColor,
        buttonTextColor: formValues.buttonTextColor,
        bussinessUnitId: 1 ?? 0, // Set your business unit ID
        tenantId: 0, // Set your tenant ID
      };

      const configDto: LoginConfigurationDto = {
        loginConfiguration: LoginConfiguration,
        backgroundImage: this.backgroundImage || undefined,
        logoImage: this.logoImage || undefined,
      };

      const formData = new FormData();
      formData.append(
        'LoginConfiguration.backgroundType',
        LoginConfiguration.backgroundType ? 'true' : 'false'
      );
      formData.append(
        'LoginConfiguration.backgroundColor',
        LoginConfiguration.backgroundColor || ''
      );
      formData.append(
        'LoginConfiguration.formBackgroundColor',
        LoginConfiguration.formBackgroundColor || ''
      );
      formData.append(
        'LoginConfiguration.textColor',
        LoginConfiguration.textColor || ''
      );
      if (LoginConfiguration.formAlignment !== undefined) {
        formData.append(
          'LoginConfiguration.formAlignment',
          LoginConfiguration.formAlignment.toString()
        );
      }
      formData.append(
        'LoginConfiguration.buttonBackgroundColor',
        LoginConfiguration.buttonBackgroundColor || ''
      );
      formData.append(
        'LoginConfiguration.buttonTextColor',
        LoginConfiguration.buttonTextColor || ''
      );
      if (LoginConfiguration.bussinessUnitId !== undefined) {
        formData.append(
          'LoginConfiguration.bussinessUnitId',
          LoginConfiguration.bussinessUnitId.toString()
        );
      }
      if (LoginConfiguration.tenantId !== undefined) {
        formData.append(
          'LoginConfiguration.tenantId',
          LoginConfiguration.tenantId.toString()
        );
      }

      formData.append('LoginConfiguration', JSON.stringify(LoginConfiguration));

      if (this.backgroundImage) {
        formData.append('backgroundImage', this.backgroundImage);
      }else{
        formData.append('backgroundImage', this.loginConfig.BackgroundImage);
      }
      if (this.logoImage) {
        formData.append('logoImage', this.logoImage);
      }else{
        formData.append('logoImage', this.loginConfig.LogoImage);
      }

      this.loginConfigService
        .InsertOrUpdateLoginConfiguration(formData)
        .subscribe({
          next: (response: any) => {
            console.log('Configuration saved successfully', response);
          },
          error: (error: any) => {
            console.error('Error saving configuration', error);
          },
        });
    }
  }

  private getFormAlignmentValue(alignment: string): number {
    switch (alignment) {
      case 'left':
        return 0;
      case 'center':
        return 1;
      case 'right':
        return 2;
      default:
        return 0;
    }
  }

  getJustifyContent(justifyContent:any): string {
    switch (justifyContent) {
      case 0:
        return 'left';
      case 1:
        return 'center';
      case 2:
        return 'right';
      default:
        return 'right'; // default value
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      console.log('Base64 string:', base64String);
      this.logoURL = base64String;
      // Use the base64 string to set the form control value or display the image
      // this.configForm.patchValue({ backgroundImage: base64String });
    };
    reader.readAsDataURL(file);

    if (event.target.files && event.target.files[0]) {
      this.logoImage = event.target.files[0];
    }
  }

  onBackgroundFileSelected(event: any) {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      console.log('Base64 string:', base64String);
      this.backgroundImageURL = base64String;
      // Use the base64 string to set the form control value or display the image
      // this.configForm.patchValue({ backgroundImage: base64String });
    };
    reader.readAsDataURL(file);

    if (event.target.files && event.target.files[0]) {
      this.backgroundImage = event.target.files[0];
    }
  }

  getLoginConfiguration() {
    this.isLoading = false;
    let data = {
      tenantId: 0,
    };

    this.loginConfigService
      .SelectLoginConfigurations(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.isLoading = true;
          console.log(response);
          this.loginConfig = response[0];
          this.configForm.patchValue({
            backgroundType: this.loginConfig.BackgroundType ? 'image' : 'color',
            backgroundColor: this.loginConfig.BackgroundColor,
            backgroundImage: null,
            loginFormBackgroundColor: this.loginConfig.FormBackgroundColor,
            textColor: this.loginConfig.TextColor,
            buttonBgColor: this.loginConfig.ButtonBackgroundColor,
            buttonTextColor: this.loginConfig.Buttontextcolor,
            alignment: this.getJustifyContent(this.loginConfig.FormAlignment),
            logoImage: null,
          });
          this.backgroundImageURL = this.attachmentURL + this.loginConfig.BackgroundImage
          this.logoURL = this.attachmentURL + this.loginConfig.LogoImage
          console.log(this.backgroundImageURL);
          

          if(this.loginConfig.BackgroundType){
            this.enableBackgroundImage = true;
          }else{
            this.enableBackgroundImage = false;
          }

          console.log(this.configForm.value);
          
        },
        error: (error: Error) => {
          this.isLoading = false;
        },
      });
  }
  
}
