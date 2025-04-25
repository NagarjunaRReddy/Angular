import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HelperService } from '../../../../../../services/helper.service';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../../../services/users.service';
import { NoWhitespaceValidator } from '../../../../../../shared/utlis/no-whitespace-validator';
import { UserManagementService } from '../../../../../../services/user-management.service';
import { RoleSelectEntity } from '../../../../../../interfaces/role-entity';
import {
  BusinessSelectEntity,
  TenantSelectEntity,
} from '../../../../../../interfaces/user-management-interface';
import { UserEntity } from '../../../../../../interfaces/user-interface';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrl: './add-edit-user.component.scss',
})
export class AddEditUserComponent implements OnInit, OnDestroy, AfterViewInit {
  userForm!: FormGroup;
  selectedvalue: string[] = [];
  subscribedService: Subscription[] = [];
  submittedForm: boolean = false;
  BusinessUnitSelect: boolean = false;
  busineesUnitData!: any;
  StatusList: any = [
    {
      data: 'Active',
      value: 1,
    },
    {
      data: 'InActive',
      value: 0,
    },
  ];
  RoleList: any;
  BussinessRoleList: any;
  RoleList_array: any[] = [];
  TenantList: any;
  TenantList_array: any[] = [];
  LanguageList: any;
  LanguageList_array: any[] = [];
  loginInfo: any;
  token: any;
  submittedGeneral: boolean;
  filteredRoles: any[] = [];
  filteredTenantList: any;
  filterBussinessRoleList: any;
  password_type: string = 'password';
  confirm_password_type: string = 'password';
  settings = {
    TableSettingsId: 3,
    RoleId: 6,
    IsScrollable: false,
    IsPagination: true,
    IsSorting: true,
    IsFilter: true,
    IsMultiselect: false,
    Pagination: true,
    TenantId: 1,
    CreatedBy: 1,
    CreatedOn: '2024-12-01T06:56:53.797',
    ModifiedBy: null,
    ModifiedOn: null,
  };
  themeSettings: any;
  savedvalues: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<AddEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private helper: HelperService,
    private userService: UsersService,
    private userManagementService: UserManagementService,
    private toastr: ToastrService
  ) {
    this.selectedvalue = [...this.savedvalues];
  }

  ngOnInit(): void {
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
    const theme =
      sessionStorage.getItem('themeSettings') ||
      JSON.stringify(this.themeSettings);


    const table = sessionStorage.getItem('tableSettings') || JSON.stringify(this.settings);
    this.settings = JSON.parse(table);

    this.getRoleData();
    this.getTenantData();
    this.getLanguageData();
    this.getBussinessRoleData();

    this.userForm = this.fb.group({
      UserId: [''],
      FirstName: [
        '',
        Validators.required,
        NoWhitespaceValidator.cannotContainSpace,
      ],
      LastName: [
        '',
        Validators.required,
        NoWhitespaceValidator.cannotContainSpace,
      ],
      Designation: [''],
      Email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ],
      ], // Email validation
      Password: [
        '',
        [Validators.required, Validators.minLength(6),
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*0-9]).{6,}$'
        ),
        ],
      ], // Password validation
      ConfirmPassword: ['', Validators.required],
      StatusId: ['', Validators.required],
      RoleId: [null, Validators.required],
      PhoneNo: ['', Validators.required],
      LanguageId: [null, Validators.required],
      TenantId: [null, Validators.required],
      Address: [
        '',
        Validators.required,
        NoWhitespaceValidator.cannotContainSpace,
      ],
      // BusinessUnits: this.fb.array([this.addformgroupforBussinesUnit()]),
      BusinessUnits: ['', Validators.required],
    });

    if (this.data.value != null && this.data.value != undefined) {
      this.getBusinessRoleByUserId(+this.data.value.UserId);
    }
  }

  addformgroupforBussinesUnit(): FormGroup {
    return this.fb.group({
      BusinessUnitId: [],
      BusinessUnit: [''],
      UserBussinesId: [],
    });
  }

  get UserBusinessDetails(): FormArray {
    return this.userForm.get('BusinessUnits') as FormArray;
  }

  addBusinessUnit() {
    const busineesUnitGroup = this.fb.group({
      BusinessUnitId: [],
      ['Business Unit']: [''], // Changed from BusinessUnit => Business Unit
    });
    this.UserBusinessDetails.push(busineesUnitGroup);
  }

  onSetValue(res: any[]) {
    this.UserBusinessDetails.clear();
    res.forEach((BusinessUnitId) => {
      const selectedUnits = this.BussinessRoleList.find(
        (unit) => unit.BusinessUnitId == BusinessUnitId
      );
      if (selectedUnits) {
        this.UserBusinessDetails.push(
          this.fb.group({
            BusinessUnitId: [selectedUnits.BusinessUnitId],
            BusinessUnit: [selectedUnits.BusinessUnit],
          })
        );
      }
    });
  }

  setBussinessUnit(value: any[]) {
    let UserBusinessDetails: any[] = []
    value.map((id) => {
      const selectedUnit = this.BussinessRoleList.find(
        (unit: any) => unit.BusinessUnitId == id
      );
      if (selectedUnit) {
        UserBusinessDetails.push(
          {
            BusinessUnitId: selectedUnit.BusinessUnitId,
            userBussinesId: this.helper.getUserBusinessId(), // Changed from BusinessUnit => Business Unit
          }
        );
      }
    });

    return UserBusinessDetails;
  }

  onselectionChange(SelectedId: MatSelectChange): void {
    console.log(SelectedId);
    let selectedValue: any[] = SelectedId.value
    selectedValue.forEach((id) => {
      const selectedUnit = this.BussinessRoleList.find(
        (unit) => unit.BusinessUnitId == id
      );
      if (selectedUnit) {
        this.UserBusinessDetails.push(
          this.fb.group({
            BusinessUnitId: [selectedUnit.BusinessUnitId],
            BusinessUnit: [selectedUnit['Business Unit']], // Changed from BusinessUnit => Business Unit
          })
        );
      }
    });
    if (this.UserBusinessDetails.value.length == 0) {
      this.BusinessUnitSelect = true; // for validations
    }
    else {
      this.BusinessUnitSelect = false;
    }
  }

  ngOnDestroy(): void {
    this.subscribedService.forEach((element) => {
      element.unsubscribe();
    });
  }



  ngAfterViewInit(): void {
 
    if (this.data.value)
      {
      this.userForm.controls['UserId'].setValue(this.data.value.UserId);
      this.userForm.controls['FirstName'].setValue(this.data.value.FirstName);
      this.userForm.controls['LastName'].setValue(this.data.value.LastName);
      this.userForm.controls['Designation'].setValue(this.data.value.Designation);
      this.userForm.controls['Email'].setValue(this.data.value.EmailId);
      this.userForm.controls['StatusId'].setValue(this.data.value.ActiveStatus);
      this.userForm.controls['LanguageId'].setValue(this.data.value.LanguageId);
      this.userForm.controls['RoleId'].setValue(this.data.value.RoleId);
      this.userForm.controls['PhoneNo'].setValue(this.data.value.ContactNo);
      this.userForm.controls['TenantId'].setValue(this.data.value.TenantId);
      this.userForm.controls['Address'].setValue(this.data.value.Address);
      this.userForm.controls['Password'].setValue(this.data.value.Password);
      this.userForm.controls['ConfirmPassword'].setValue(this.data.value.ConfirmPassword);
    }
    else {
      setTimeout(() => {
        this.userForm.controls['Designation'].setValue('');
        this.userForm.controls['Password'].setValue('');
      }, 700);
    }
  }
  togglePasswordMode()
  {
    this.password_type = this.password_type === 'text' ? 'password' : 'text';
  }
  toggleConfirmPasswordMode()
  {
    this.confirm_password_type = this.confirm_password_type === 'text' ? 'password' : 'text';
  }



  getTenantData()
   {
    let tenantData: TenantSelectEntity = 
    {
    TenantId: 0,
    };
    const tenantGetService = this.userManagementService
      .getTenantData(tenantData)
      .subscribe(
        (res: any) => {
          if (res.length != 0 && res != undefined) {
            this.TenantList = res;
            this.filteredTenantList = res;
            this.TenantList_array = res;
          }
        },
        (error) => {
          this.toastr.error('Some Error Occured', 'ERROR');
        }
      );
    this.subscribedService.push(tenantGetService);
  }


  getLanguageData() {
    const userGetService = this.userManagementService
      .getLanguageData()
      .subscribe(
        (res: any) => {
          if (res.length != 0 && res != undefined) {
            this.LanguageList = res;
            this.LanguageList_array = res;
          }
        },
        (error) => {
          this.toastr.error('Some Error Occured', 'ERROR');
        }
      );
    this.subscribedService.push(userGetService);
  }


  getRoleData() {
    let roleData: RoleSelectEntity = {
      RoleId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };

    const userRoleService = this.userManagementService
      .getRoleData(roleData)
      .subscribe(
        (res: any) => {
          if (res.length != 0 && res != undefined) {
            this.RoleList = res;
            this.filteredRoles = res;
            this.RoleList_array = res;
          }
        },
        (error) => {
          this.toastr.error('Some Error Occured', 'ERROR');
        }
      );
    this.subscribedService.push(userRoleService);
  }




  SetBusinessUnit(BusinessUnitId) 
  {
    if (this.BussinessRoleList !== undefined) {
      const SelectedValues = this.BussinessRoleList.find(
        (Item) => Item.BusinessUnitId == BusinessUnitId
      );
      if (SelectedValues) {
        this.UserBusinessDetails.push(
          this.fb.group({
            BusinessUnitId: [SelectedValues.BusinessUnitId],
            BusinessUnit: [SelectedValues['Business Unit']], // Changed from BusinessUnit => Business Unit
          })
        );
      }
    }
  }



  getBusinessRoleByUserId(UserId: number) 
  {
    if (this.UserBusinessDetails.length > 0) {
      this.UserBusinessDetails.clear();
    }
    const businessService = this.userService
      .UserBusinessUnitSelectByid(UserId)
      .subscribe((res: any) => {
        console.log(res);

        if (res != null) {
          this.filterBussinessRoleList = res;
          this.selectedvalue = this.filterBussinessRoleList.map(
            (role) => role.BusinessUnitId
          );
          this.selectedvalue[0];
          for (let i = 0; i < this.selectedvalue.length; i++) {
            this.SetBusinessUnit(this.selectedvalue[i]);
            // this.onselectionChange([i]);
          }
        }
      });
  }




  getBussinessRoleData() {
    let BusinessRoleData: BusinessSelectEntity = {
      BusinessUnitId: 0,
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };

    const userBusinessroleService = this.userManagementService
      .getBussinessRoleData(BusinessRoleData)
      .subscribe(
        (res: any) => {
          if (res != null && res.length != 0 && res != undefined) {
            this.BussinessRoleList = res;
          }
        },
        (error) => {
          this.toastr.error('Some Error Occured', 'ERROR');
        }
      );
    this.subscribedService.push(userBusinessroleService);
  }



  confirmPasswordValidator() {
    const newPassword = this.userForm.get('Password')?.value;
    const confirmPassword = this.userForm.get('ConfirmPassword')?.value;
    const newPwdControl: any = this.userForm.get('ConfirmPassword');
    if (newPassword !== confirmPassword) {
      newPwdControl.setErrors({ pswdNotMatch: true }); // Set an error if passwords don't match
    }
  }

  FilterLine(data: any) {
    this.filteredRoles = this.RoleList.filter((role) =>
      role.RoleName.toLowerCase().includes(data.toLowerCase())
    );
  }
  FilterTenant(data: any) {
    this.filteredTenantList = this.TenantList.filter((tenant) =>
      tenant.TenantName.toLowerCase().includes(data.toLowerCase())
    );
  }
  FilterBusinessList(data: any) {
    this.filterBussinessRoleList = this.BussinessRoleList.filter((tenant) =>
      tenant.BusinessUnit.toLowerCase().includes(data.toLowerCase())
    );
  }

  //to check the invalid form controls
  // const invalid = [];
  // const controls = this.UserForm.controls;
  // for (const name in controls) {
  //     if (controls[name].invalid) {
  //         invalid.push(name);
  //         console.log(invalid);
  //     }
  // }

  onSave(): void
  {
    if (this.userForm.invalid)
     {
      this.submittedForm = true; 
      this.userForm.markAllAsTouched();
      return; 
    }
     else
    {
      this.submittedForm = false;   
    }
    this.submittedGeneral = true; // Mark the form as generally submitted.

    const userData: UserEntity = {
      UserId:
        this.userForm.controls['UserId'].value == ''
          ? 0
          : this.userForm.controls['UserId'].value,
      FirstName: this.userForm.controls['FirstName'].value.trim(),
      LastName: this.userForm.controls['LastName'].value.trim(),
      EmailId: this.userForm.controls['Email'].value.trim(),
      Designation: this.userForm.controls['Designation'].value.trim(),
      Password: this.userForm.controls['Password'].value,
      ConfirmPassword: this.userForm.controls['ConfirmPassword'].value,
      RoleId: this.userForm.controls['RoleId'].value,
      ActiveStatus: this.userForm.controls['StatusId'].value,
      ContactNo: this.userForm.controls['PhoneNo'].value.toString(),
      Address: this.userForm.controls['Address'].value,
      TenantId: this.userForm.controls['TenantId'].value,
      LanguageId: this.userForm.controls['LanguageId'].value,
      UserBusinessDetails: this.setBussinessUnit(this.userForm.controls['BusinessUnits'].value),
    };

    const userInsertService = this.userService
      .insertUpdateUser(userData)
      .subscribe(
        (res: any) => {
          if (res[0].SuccessMessage) {
            this.toastr.success(res[0].SuccessMessage, 'Success');
            this.dialogRef.close(true);
          } else {
            this.toastr.error(res[0].ErrorMessage, 'Error');
          }
        }
        // (error) => {
        //   this.toastr.error('Form Not Valid', 'ERROR');
        // }
      );
    this.subscribedService.push(userInsertService);
  }

  passwordValidator() {
    this.confirmPasswordValidator()
  }

  onCancel(): void {
    this.dialogRef.close(''); // Return 'false' to indicate cancellation.
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 47 && charCode < 58) {
      return true;
    }
    return false;
  }
}
