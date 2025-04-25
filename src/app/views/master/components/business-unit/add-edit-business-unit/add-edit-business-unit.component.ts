import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { BusinessUnitService } from '../../../../../services/business-unit.service';
import { HelperService } from '../../../../../services/helper.service';
import { BaseService } from '../../../../../base/base.service';
import { NoWhitespaceValidator } from '../../../../../shared/utlis/no-whitespace-validator';
import { BusinessUnitEntity } from '../../../../../interfaces/business-unit-entity';

@Component({
  selector: 'app-add-edit-business-unit',
  templateUrl: './add-edit-business-unit.component.html',
  styleUrl: './add-edit-business-unit.component.scss'
})
export class AddEditBusinessUnitComponent {
  addEditForm!: FormGroup;
  submittedForm: boolean = false;
  submittedGeneral: boolean = false;
  loginInfo: any;
  subscribedService: Subscription[] = [];
  selectedFile: File | null = null;
  attachmentFiles: any[]=[];
  imageURL: any;
  iconUrl: any;
  iconName: any;

  constructor( 
    public dialogRef: MatDialogRef<AddEditBusinessUnitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private businessService: BusinessUnitService,
    private helper: HelperService,
    private baseService:BaseService,

  ){}

  ngOnInit(): void {
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo')||'{}');
    this.iconUrl = this.baseService.iconUrl
    this.addEditForm = this.fb.group({
      buId: [''],
      buName: ['', Validators.required, NoWhitespaceValidator.cannotContainSpace],
      IconName: ['', Validators.required],
      capacity: ['', Validators.required],  // Capacity dropdown field
      Attachments: ['']
    });

    if (this.data.value) {
      console.log(this.data.value,"this.data.value");
      console.log(this.baseService.iconUrl);
      
      this.addEditForm.controls['buId'].setValue(this.data.value.BusinessUnitId);
      this.addEditForm.controls['buName'].setValue(this.data.value['Business Unit']);
      this.addEditForm.controls['capacity'].setValue(this.data.value['Capacity']);
      this.addEditForm.controls['IconName'].setValue(this.data.value['Icon']);
      this.iconUrl = this.baseService.iconUrl + this.data.value['Icon']
      // Set the iconName for image display
      this.iconName = this.data.value['Icon'];
    }
  }

  ngOnDestroy(): void {
    this.subscribedService.forEach((element) => {
      element.unsubscribe();
    });
  }
  handleImageError() {
    console.error("Image failed to load. Check iconUrl or iconName.");
}
isImageFile(fileName: string): boolean {
  return /\.(jpg|jpeg|png|gif)$/i.test(fileName); // Check for image file extension
}

onSave(): void {
  // Check if the form is valid
  if (this.addEditForm.invalid) {
      this.submittedForm = true; // Show validation errors
      return;
  } else {
      this.submittedForm = false;
  }

  this.submittedGeneral = true;

  // Build the business unit data object
  const businessData: BusinessUnitEntity = {
      BusinessUnitId: this.addEditForm.controls['buId'].value || 0,
      BusinessUnitName: this.addEditForm.controls['buName'].value.trim() || '',
      Capacity: this.addEditForm.controls['capacity'].value || '0',
      IconName: this.addEditForm.controls['IconName'].value || '', // This will be updated after the image upload
      TenantId: this.loginInfo.TenantId || 0,
      CreatedBy: this.loginInfo.CreatedBy || 0,
      //Attachments: [] // Keep it if needed; otherwise, remove
  };
 
  // Create FormData instance to hold both file and form data
  const formData = new FormData();

  // Add the selected file (assuming only one file is selected)
  if (this.selectedFile) {
    formData.append('ImageFile', this.selectedFile, this.selectedFile.name); // Append single file
} else {
    // Handle case where no file is selected (optional)
    console.warn('No file selected for upload.');
}

  // Append individual properties of the business data to FormData
  formData.append('businessUnitEntity.BusinessUnitId', businessData.BusinessUnitId?.toString() || '0');
  formData.append('businessUnitEntity.BusinessUnitName', businessData.BusinessUnitName.trim() || '');
  formData.append('businessUnitEntity.Capacity', businessData.Capacity || '0');
  formData.append('businessUnitEntity.IconName', businessData.IconName || '0');
  formData.append('businessUnitEntity.TenantId', businessData.TenantId?.toString() || '0');
  formData.append('businessUnitEntity.CreatedBy', businessData.CreatedBy?.toString() || '0');

  console.log(this.selectedFile, "Selected files");
  // Append form data to FormData object
  formData.append('businessUnitEntity', JSON.stringify(businessData)); // Append business data as a JSON string

  // Log for debugging
  console.log(JSON.stringify(businessData), "businessDataString");
  console.log(formData, "formData");

  // Send the form data to the backend via your service method
  const businessUnitInsertService = this.businessService.BusinessUnitInsertUpdate(formData)
      .subscribe(
          (response: any) => {
            console.log(response,"response");
              if (response[0].Success) {
                  this.toastr.success(response[0].Success, 'SUCCESS');
                  this.dialogRef.close(true);
              } 
              else if (response[0].Error) {
                this.toastr.error(response[0].Error, 'ERROR');
              }
              else {
                  this.toastr.error(response.message || 'An error occurred', 'Error');
              }
          },
          (error: any) => {
              this.toastr.error("Some Error Occurred", "ERROR");
          }
      );

  this.subscribedService.push(businessUnitInsertService);
}

onCancel(): void {
  this.dialogRef.close(''); // Return 'false' to indicate cancellation.
}

onFileSelected(event: any): void {
  const input = event.target as HTMLInputElement;
  const file = event.target.files[0];
  const fileInput = event.target;
  const reader = new FileReader();

  if (input?.files && input.files.length > 0) {
      // Assign the first file from the FileList to selectedFile
      reader.onload = () => {
        this.selectedFile = file;
        // Read the file content if needed
        // Patch the form control with the file and its extension
        this.iconUrl = reader.result as string;
        this.iconName = file.name
      };
      reader.readAsDataURL(file);
      this.selectedFile = input.files[0]; // Extract the first file
  } else {
      this.selectedFile = null; // If no file is selected
  }
}


}
