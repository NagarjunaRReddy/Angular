import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ProductionPoolService } from '../../../../../services/production-pool.service';
import { HelperService } from '../../../../../services/helper.service';
import { NoWhitespaceValidator } from '../../../../../shared/utlis/no-whitespace-validator';
import { ProductionPool } from '../../../../../interfaces/production-pool';
import { SiteSelectEntity } from '../../../../../interfaces/siteentity';
import { SiteService } from '../../../../../services/site.service';

@Component({
  selector: 'app-addeditproductionpool',
  templateUrl: './addeditproductionpool.component.html',
  styleUrl: './addeditproductionpool.component.scss',
})
export class AddeditproductionpoolComponent {
  addEditForm!: FormGroup;
  submittedForm: boolean = false;
  submittedGeneral: boolean = false;
  loginInfo: any;
  subscribedService: Subscription[] = [];
  siteList: any;
  filteredSites: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddeditproductionpoolComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private productionPoolService: ProductionPoolService,
    private helper: HelperService,
    private SiteMasterService: SiteService
  ) {}

  ngOnInit() {
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
    this.addEditForm = this.fb.group({
      productionPool_Id: [''],
      production_Pool: [
        '',
        Validators.required,
        NoWhitespaceValidator.cannotContainSpace,
      ],
      site_Id: ['', Validators.required],
    });

    if (this.data.value) {
      this.addEditForm.controls['productionPool_Id'].setValue(
        this.data.value.ProductionPoolId
      );
      this.addEditForm.controls['production_Pool'].setValue(
        this.data.value['Production Pool'].trim()
      );
      this.addEditForm.controls['site_Id'].setValue(this.data.value.SiteId);
    }
    this.getSiteData();
  }

  ngOnDestroy(): void {
    this.subscribedService.forEach((element) => {
      element.unsubscribe();
    });
  }

  getSiteData() {
    let SiteData: SiteSelectEntity = {
      SiteId: 0,
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };
    const siteDataService = this.SiteMasterService.getSite(SiteData).subscribe(
      (res: any) => {
        if (res.length != 0 && res != undefined) {
          this.siteList = res;
          console.log(res, 'sites');
        }
      },
      (error) => {
        this.toastr.error('some Error Occured', 'ERROR');
      }
    );
    this.subscribedService.push(siteDataService);
  }

  FilterSite(data: any) {
    this.filteredSites = this.siteList.filter((site) =>
      site.SiteName.toLowerCase().includes(data.toLowerCase())
    );
  }

  onSave(): void {
    if (this.addEditForm.invalid) {
      this.submittedForm = true; // Mark the form as submitted.
      return; // Stop execution if the form is invalid.
    } else {
      this.submittedForm = false; // Reset the form submission status.
    }
    this.submittedGeneral = true; // Mark the form as generally submitted.
    const productionpoolData: ProductionPool = {
      productionPoolId:
        this.addEditForm.controls['productionPool_Id'].value == ''
          ? 0
          : this.addEditForm.controls['productionPool_Id'].value,
      productionPool: this.addEditForm.controls['production_Pool'].value.trim(),
      siteId: this.addEditForm.controls['site_Id'].value,
      tenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      createdBy: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };
    const ProductionPoolInsertService = this.productionPoolService
      .InsertUpdateProductionPool(productionpoolData)
      .subscribe(
        (response: any) => {
          if (response[0].SuccessMessage) {
            this.toastr.success(response[0].SuccessMessage, 'Success');
            this.dialogRef.close(true);
          } else {
            this.toastr.error(response[0].ErrorMessage, 'Error');
          }
        },
        (error: any) => {
          this.toastr.error('Some Error Occured', 'ERROR');
        }
      );
    this.subscribedService.push(ProductionPoolInsertService);
  }

  onCancel(): void {
    this.dialogRef.close(''); // Return 'false' to indicate cancellation.
  }

  onselectionChange(SelectedId: number[]): void {
    SelectedId.forEach((id) => {
      const Site = this.siteList.find((site) => site.SiteId == id);
      if (Site) {
        this.addEditForm.controls['site_Id'].setValue(Site.SiteId);
      }
    });
  }
}
