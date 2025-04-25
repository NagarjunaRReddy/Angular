import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseService } from '../../../base/base.service';

@Component({
  selector: 'app-login-preview',
  templateUrl: './login-preview.component.html',
  styleUrl: './login-preview.component.scss'
})
export class LoginPreviewComponent {

  loginForm: FormGroup;
  @Input() formData: any;
  @Input() backgroundImageURL: string | undefined;
  @Input() logoURL: string | undefined;
  attachmentURL:string = ""
  dynamicStyles: { [key: string]: string } = {};

  constructor(private fb: FormBuilder, private router: Router, private base:BaseService){
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  
  ngOnInit(): void {
    console.log(this.backgroundImageURL);
    this.updateDynamicStyles();
    this.attachmentURL = this.base.iconUrl;
    this.backgroundImageURL = this.backgroundImageURL
      
  }

  updateDynamicStyles(): void {
    this.dynamicStyles = {
      'background-color': this.formData.backgroundType === 'color' ? this.formData.backgroundColor : '',
      'background-image': this.formData.backgroundType === 'image' ? `url(${this.backgroundImageURL})` : 'none',
      'justify-content': this.formData.alignment
    };
  }

  onSubmit(): void {
    console.log(this.router);
    
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
    }
    this.router.navigateByUrl('main') 
  }

}
