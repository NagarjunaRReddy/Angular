import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { HelperService } from '../../../services/helper.service';
import { CoStatusService } from '../../production-planning/services/co-status.service';
import { BomService } from '../../production-planning/services/bom.service';
import { SpecReviewService } from '../../production-planning/services/spec-review.service';
import { SpecreviewService } from '../../production-planning/services/specreview.service';
import { COStatusSelectEntity } from '../../production-planning/interfaces/co-status-interface';
import { SpecreviewstatusSelectEntity } from '../../production-planning/interfaces/spec-review-interface';
import { BOMStatusSelectEntity } from '../../production-planning/interfaces/bom-interface';
import { SpecReviewBOMCOEntity } from '../../production-planning/interfaces/SpecReview-interface';


@Component({
  selector: 'app-spec-review-view',
  templateUrl: './spec-review-view.component.html',
  styleUrls: ['./spec-review-view.component.scss'],
})
export class SpecReviewViewComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable, { static: false }) table!: MatTable<any>;

  loginInfo: any;
  columns: any;
  addEditForm!: FormGroup;
  specData: any[] = [];
  bomData: any[] = [];
  changeData: any[] = [];
  public displayedColumns;
  subscribedService: Subscription[] = [];
  public dataSource = new MatTableDataSource<any>();
  submittedForm: boolean;
  submittedGeneral: boolean;
  action: any;
  btnsave: boolean = false;
  BOMStatusId: any;
  ChangeOrderStatusId: any;
  SpecReviewStatusId: any;
  constructor(
    public dialogRef: MatDialogRef<SpecReviewViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private helper: HelperService,
    private costatusService: CoStatusService,
    private bomService: BomService,
    private specService: SpecReviewService,
    private specReviewService: SpecreviewService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    console.log(this.data);

    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));

    // if (this.data && this.data.action === 'view') {
    //   this.action = 'All';
    //   this.btnsave = false;
    // }

    // if (typeof this.data.action === 'undefined') {
    //   this.action = 'All';
    //   this.btnsave = true;
    // } else {
    //   this.action = this.data.action;
    //   this.btnsave = true;
    // }
    if (this.data.action) {
      this.action = this.data.action;
      this.btnsave = true;
    } else {
      this.action = this.data?.action || 'All';
      this.btnsave = false;
    }
    console.log(this.action, 'this.action');
    this.addEditForm = this.fb.group({
      specReviewBOMCOId: [''],
      spec_Date: [null],
      bom_Date: [null],
      change_Date: [null],
      spec_Status: [''],
      bom_Status: [''],
      change_Status: [''],
      //comments: ['', Validators.required, NoWhitespaceValidator.cannotContainSpace]
      //comments: [''],
      specreviewcomments: [''],
      bomcomments: [''],
      changeordercomments: [''],
    });

    this.BindSalesOrderById();
    this.BindSpecreviewStatus();
    this.BindBillOfMaterial();
    this.BindChangeOrderStatus();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscribedService.forEach((element) => {
      element.unsubscribe();
    });
  }

  BindChangeOrderStatus() {
    let coData: COStatusSelectEntity = {
      CustomerOrderStatusId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };

    const coStatusSelectService = this.costatusService
      .GetCOStatus(coData)
      .subscribe(
        (res: any) => {
          if (!res[0].Message) {
            this.changeData = res;
          }
        },
        (error) => {
          this.toastr.error('Some Error Occured', 'ERROR');
        }
      );
    this.subscribedService.push(coStatusSelectService);
  }

  BindBillOfMaterial() {
    let bomData: BOMStatusSelectEntity = {
      BOMStatusId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };
    const bomSelectService = this.bomService.GetBom(bomData).subscribe(
      (res: any) => {
        if (!res[0].Message) {
          this.bomData = res;
        }
      },
      (error) => {
        this.toastr.error('Some Error Occured', 'ERROR');
      }
    );
    this.subscribedService.push(bomSelectService);
  }

  BindSpecreviewStatus() {
    let specData: SpecreviewstatusSelectEntity = {
      SpecreviewstatusId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };
    const specSelectService = this.specService.getSpec(specData).subscribe(
      (res: any) => {
        if (!res[0].Message) {
          this.specData = res;
        }
      },
      (error) => {
        this.toastr.error('Some Error Occured', 'ERROR');
      }
    );
    this.subscribedService.push(specSelectService);
  }

  ConvertDate(date: any): string {
    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return ''; // Return empty string if the date is invalid
      }
  
      const cdate = this.datePipe.transform(parsedDate, 'MM/dd/yy');
      if (cdate === '01/01/00' || cdate === '01/01/01' || cdate === null) {
        return '';
      } else {
        return cdate;
      }
    } else {
      return '';
    }
  }
  

  BindSalesOrderById() {
    this.displayedColumns = [
      'SONumber',
      'CategoryName',
      'SubCategoryName',
      'DealerName',
      'Customername',
      'Sold_Date',
      'site',
      'Status',
    ];
    this.columns = [
      { field: 'Sold_Date', header: 'Sold Date' },
      { field: 'SONumber', header: 'SO' },
      { field: 'CategoryName', header: 'Category' },
      { field: 'SubCategoryName', header: 'Sub Category' },
      { field: 'DealerName', header: 'Dealer Name' },
      { field: 'Customername', header: 'End User' },
      { field: 'site', header: 'Site' },
      { field: 'Status', header: 'S&OP Truck Status' },
    ];
    if (this.data.value) {
      this.dataSource.data = [this.data.value];
      if(this.ConvertDate(this.data.value.SpecReviewDate) != '' && this.ConvertDate(this.data.value.SpecReviewDate) != null){
        this.addEditForm.controls['spec_Date'].setValue(
          new Date(this.ConvertDate(this.data.value.SpecReviewDate))
        );
      }else{
        this.addEditForm.controls['spec_Date'].setValue(
          ''
        )
      }

      if(this.ConvertDate(this.data.value.BOMDate) != '' && this.ConvertDate(this.data.value.BOMDate) != null){
        this.addEditForm.controls['bom_Date'].setValue(new Date(this.ConvertDate(this.data.value.BOMDate)));
      }else{
        this.addEditForm.controls['bom_Date'].setValue('');
      }

      if(this.ConvertDate(this.data.value.changeOrderdate) != '' && this.ConvertDate(this.data.value.changeOrderdate) != null){
        this.addEditForm.controls['change_Date'].setValue(new Date(this.ConvertDate(this.data.value.changeOrderdate)));
      }else{
        this.addEditForm.controls['change_Date'].setValue('');
      }

      this.addEditForm.controls['spec_Status'].setValue(
        this.data.value.SpecReviewId
      );
      this.addEditForm.controls['bom_Status'].setValue(this.data.value.BOMId);
      this.addEditForm.controls['change_Status'].setValue(
        this.data.value.ChangeOrderId
      );
      //this.addEditForm.controls['comments'].setValue(this.data.value.comments);
      this.addEditForm.controls['specreviewcomments'].setValue(this.data.value.SpecReviewComments);
      this.addEditForm.controls['bomcomments'].setValue(this.data.value.BOMComments);
      this.addEditForm.controls['changeordercomments'].setValue(this.data.value.ChangeOrderComments);
    }
    if (this.data.view) {
      console.log(this.data.view,"this.data.view");
      

      this.addEditForm.controls['spec_Date'].disable();
      this.addEditForm.controls['bom_Date'].disable();
      this.addEditForm.controls['change_Date'].disable();
      this.addEditForm.controls['spec_Status'].disable();
      this.addEditForm.controls['bom_Status'].disable();
      this.addEditForm.controls['change_Status'].disable();
      //this.addEditForm.controls['comments'].disable();
      this.addEditForm.controls['specreviewcomments'].setValue(this.data.value.SpecReviewComments);
      this.addEditForm.controls['bomcomments'].setValue(this.data.value.BOMComments);
      this.addEditForm.controls['changeordercomments'].setValue(this.data.value.ChangeOrderComments);
    }
  }

  ngAfterViewInit() {
    // Set sorting and pagination for the MatTable
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onSave(): void {
    if (this.addEditForm.invalid) {
      this.submittedForm = true; // Mark the form as submitted.
      this.addEditForm.markAllAsTouched();
      return; // Stop execution if the form is invalid.
    } else {
      this.submittedForm = false; // Reset the form submission status.
    }
    this.submittedGeneral = true; // Mark the form as generally submitted.
    console.log(this.data.action, 'action');
    if (this.data.action === 'All') {
      if (this.addEditForm.controls['bom_Status'].value != null) {
        this.BOMStatusId = this.addEditForm.controls['bom_Status'].value;
      } else {
        this.toastr.error('Please Enter BOM Status', 'ERROR');
        return;
      }
      if (this.addEditForm.controls['change_Status'].value != null) {
        this.ChangeOrderStatusId =
          this.addEditForm.controls['change_Status'].value;
      } else {
        this.toastr.error('Please Enter Change Order Status', 'ERROR');
        return;
      }
      if (this.addEditForm.controls['spec_Status'].value != null) {
        this.SpecReviewStatusId =
          this.addEditForm.controls['spec_Status'].value;
      } else {
        this.toastr.error('Please Enter Spec Review Status', 'ERROR');
        return;
      }
    }

    if (this.data.action === 'Spec Review') {
      if (this.addEditForm.controls['spec_Status'].value != null) {
        this.SpecReviewStatusId =
          this.addEditForm.controls['spec_Status'].value;
      } else {
        this.toastr.error('Please Enter Spec Review Status', 'ERROR');
        return;
      }
    }
    if (this.data.action === 'BOM') {
      if (this.addEditForm.controls['bom_Status'].value != null) {
        this.BOMStatusId = this.addEditForm.controls['bom_Status'].value;
      } else {
        this.toastr.error('Please Enter BOM Status', 'ERROR');
        return;
      }
    }
    if (this.data.action === 'Change Order') {
      if (this.addEditForm.controls['change_Status'].value != null) {
        this.ChangeOrderStatusId =
          this.addEditForm.controls['change_Status'].value;
      } else {
        this.toastr.error('Please Enter Change Order Status', 'ERROR');
        return;
      }
    }
    const SpecReviewBOMCO: SpecReviewBOMCOEntity = {
      SpecReviewBOMCOId:
        this.addEditForm.controls['specReviewBOMCOId'].value === ''
          ? 0
          : this.addEditForm.controls['specReviewBOMCOId'].value,
      SalesOrderId:
        this.dataSource.data.length > 0 && this.dataSource.data[0].SONumber
          ? this.dataSource.data[0].SONumber
          : 0,
      BOMDate: this.addEditForm.controls['bom_Date'].value ? this.datePipe.transform(this.addEditForm.controls['bom_Date'].value, "dd-MMM-yyyy") : '',

      BOMStatusId: this.addEditForm.controls['bom_Status'].value || 0,
      ChangeOrderStatusId:
        this.addEditForm.controls['change_Status'].value || 0,
      SpecReviewStatusId:
        this.addEditForm.controls['spec_Status'].value || 0,

      ChangeOrderDate: this.addEditForm.controls['change_Date'].value ? this.datePipe.transform(this.addEditForm.controls['change_Date'].value, "dd-MMM-yyyy") : '',

      SpecReviewDate: this.addEditForm.controls['spec_Date'].value ? this.datePipe.transform(this.addEditForm.controls['spec_Date'].value, "dd-MMM-yyyy"):'',

      CreatedBy: this.loginInfo.CreatedBy ? this.loginInfo.CreatedBy : 0,
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      //Comments: this.addEditForm.controls['comments'].value
        //? this.addEditForm.controls['comments'].value
       // : null,
       SpecReviewComments: this.addEditForm.controls['specreviewcomments'].value
        ? this.addEditForm.controls['specreviewcomments'].value
        : null,
        BOMComments: this.addEditForm.controls['bomcomments'].value
        ? this.addEditForm.controls['bomcomments'].value
        : null,
        ChangeOrderComments: this.addEditForm.controls['changeordercomments'].value
        ? this.addEditForm.controls['changeordercomments'].value
        : null,
      Action: this.data.action == "Spec Review" ? "SpecReview": this.data.action == "Change Order" ? "ChangeOrder" : this.data.action,

      // SpecReviewBOMCOId: this.addEditForm.controls['specReviewBOMCOId'].value == "" ? 0 : this.addEditForm.controls['specReviewBOMCOId'].value,
      // SalesOrderId: this.dataSource.data[0].SONumber ? this.dataSource.data[0].SONumber : 0,
      // BOMDate: this.datePipe.transform(this.addEditForm.controls['bom_Date'].value, 'yyyy-MM-dd'), //this.addEditForm.controls['bom_Date'].value,
      // BOMStatusId: this.addEditForm.controls['bom_Status'].value? ,
      // ChangeOrderDate: this.datePipe.transform(this.addEditForm.controls['change_Date'].value, 'yyyy-MM-dd'),
      // ChangeOrderStatusId: this.addEditForm.controls['change_Status'].value,
      // SpecReviewDate: this.datePipe.transform(this.addEditForm.controls['spec_Date'].value, 'yyyy-MM-dd'),
      // SpecReviewStatusId: this.addEditForm.controls['spec_Status'].value,
      // CreatedBy: this.loginInfo.CreatedBy ? this.loginInfo.CreatedBy : 0,
      // TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      // Comments: this.addEditForm.controls['comments'].value
    };

    const speccReviewService = this.specReviewService
      .SpecReviewBOMCOInsertUpdate(SpecReviewBOMCO)
      .subscribe(
        (response: any) => {
          if (response[0].SuccessMessage) {
            this.toastr.success(response[0].SuccessMessage, 'Success');
            this.dialogRef.close(true);
          } else {
            this.toastr.error(response[0].ErrorMessage, 'Error');
          }
        },
        (error) => {
          this.toastr.error('Some Error Occured', 'ERROR');
        }
      );
    this.subscribedService.push(speccReviewService);
  }

  onCancel(): void {
    this.dialogRef.close(''); // Return 'false' to indicate cancellation.
  }
}
