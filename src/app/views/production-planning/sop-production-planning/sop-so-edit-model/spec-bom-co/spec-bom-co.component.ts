import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription, firstValueFrom } from 'rxjs';

import { AddEditBomItemsComponent } from './add-edit-bom-items/add-edit-bom-items.component';
import { HelperService } from '../../../../../services/helper.service';
import { BaseService } from '../../../../../base/base.service';
import { SpecReviewService } from '../../../services/spec-review.service';
import { ProductionPlanningService } from '../../../services/production-planning.service';
import { BomService } from '../../../services/bom.service';
import { CoStatusService } from '../../../services/co-status.service';
import { CoModeService } from '../../../services/co-mode.service';
import { SpecreviewstatusSelectEntity } from '../../../interfaces/spec-review-interface';
import { BOMStatusSelectEntity } from '../../../interfaces/bom-interface';
import { COStatusSelectEntity } from '../../../interfaces/co-status-interface';
import { ConfirmDialogComponent } from '../../../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-spec-bom-co',
  templateUrl: './spec-bom-co.component.html',
  styleUrls: ['./spec-bom-co.component.scss'],
})
export class SpecBomCoComponent implements OnInit {

  specForm: FormGroup;
  bomForm: FormGroup;
  coForm: FormGroup;


  @Input() specData: any[]=[];
  @Input() bomData: any[]=[];
  @Input() coData: any[]=[];
  @Input() soNumber: any;
  @Input() panView: any;
  @Input() commonTableData: any[]=[];
  loginInfo: any;
  specStatusList: any[]=[];
  subscribedService: Subscription[]=[];
  step: number = 0;
  bomStatusList: any[]=[];
  bomBgColor: any;
  specBgColor: any;
  coStatusList: any[]=[];
  coHeaderColor: any[]=[];
  coModeList: any[]=[];
  selectedImagesFile: File | null = null;
  items:any[] = [];

  displayedItems = [];
  initialLoad = 2;
  loadMoreCount = 4;
  coColorCode: any="";

  constructor(
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private toastr: ToastrService,
    public fb: FormBuilder,
    private helper: HelperService,
    public base: BaseService,
    private specService: SpecReviewService,
    private ProductionPlanService: ProductionPlanningService,
    private bomService: BomService,
    private coService: CoStatusService,
    private coModeService: CoModeService,
  ) {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);
    
    if (changes['specData'] || changes['bomData'] || changes['coData']) {
      this.ngOnInit();
      this.ngAfterViewInit();
    }
  }

  async ngOnInit() {
    //console.log(this.coData);
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
    this.specForm = this.fb.group({
      specStatus: [0],
      specDate: [null],
      specComment: [''],
    });
    this.bomForm = this.fb.group({
      bomStatus: [0],
      bomDate: [null],
      bomComment: [''],
    });
    this.coForm = this.fb.group({
      coForms: this.fb.array([])
    });
    this.getSpecReviewStatus();
    this.getBomReviewStatus();
    await this.getCoReviewStatus();
    this.getCoMode();
    this.displayedItems = this.items.slice(0, this.initialLoad);
  }

  get coForms(): FormArray {
    return this.coForm.get('coForms') as FormArray;
  }

  createCoForm(): FormGroup {
    return this.fb.group({
      coStatus: [0, Validators.required],
      coDate: [null, Validators.required],
      coComment: ['', Validators.required],
      coMode: [0, Validators.required],
      priority: [null],
      file:[null],
      fileName:[''],
      fileType:[''],
      displayName:[''],
      // other form controls if any
    });
  }

  addCoForm(): void {
    this.coForms.push(this.createCoForm());
  }

  removeCOForm(index: number): void {
    this.coForms.removeAt(index);
    this.coHeaderColor.splice(index,1);
    this.getCoCode();
  }

  loadMore() {
    const currentLength = this.displayedItems.length;
    const nextItems = this.items.slice(currentLength, currentLength + this.loadMoreCount);
    this.displayedItems = this.displayedItems.concat(nextItems);
  }

  setCoHeaderColor(item:any,index:any){
    console.log(this.coData);
    console.log(item);
    this.coForms.at(index).patchValue({priority :item.priority});
    this.coHeaderColor[index]=item?.Colorcode;
    console.log(this.coForms.value);
      // Output: 1
    // this.getCoCode();
    const priority = this.checkPriority();
    const priorityColor = this.coStatusList.find((item:any) => item.priority == priority);
    console.log(priorityColor);
    this.coColorCode = priorityColor?.Colorcode;
  }

   checkPriority() {
    const lowestPriority = this.coForms.value.reduce((min: any, obj: any) => {
      return obj.priority !== null && obj.priority !== undefined && obj.priority < min 
        ? obj.priority 
        : min;
    }, Number.POSITIVE_INFINITY);
    
    console.log(lowestPriority);
    return lowestPriority;
  }
  

  getSpecReviewStatus(){
    let specData: SpecreviewstatusSelectEntity = {
      SpecreviewstatusId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    }
    const specGetService = this.specService.getSpec(specData)
      .subscribe((res: any) => {
        if (!res[0].Message) {
          this.specStatusList = res;
        }
        else {
          this.specStatusList = [];
        }
      },
        error => {
          this.toastr.error("Some Error Occured", "ERROR");
        });
    this.subscribedService.push(specGetService);
  }

  getBomReviewStatus(){
    let bomData: BOMStatusSelectEntity = {
      BOMStatusId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    }
    const bomGetService = this.bomService.GetBom(bomData)
      .subscribe((res: any) => {
        if (!res[0].Message) {
          this.bomStatusList = res;
        }
        else {
          this.bomStatusList = [];
        }
      },
        error => {
          this.toastr.error("Some Error Occured", "ERROR");
        });
    this.subscribedService.push(bomGetService);
  }

  async getCoReviewStatus() {
    let coData: COStatusSelectEntity = {
      CustomerOrderStatusId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    };
  
    try {
      const res: any = await firstValueFrom(this.coService.GetCOStatus(coData));
      
      if (!res[0].Message) {
        this.coStatusList = res;
        this.getCoCode();
      } else {
        this.coStatusList = [];
      }
    } catch (error) {
      // this.toastr.error("Some Error Occurred", "ERROR");
    }
  }
  


  getCoMode(){
    let coModeData: any = {
      CustomerOrderStatusId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    }

    const coGetService = this.coModeService.GetCOMode(coModeData)
      .subscribe((res: any) => {
        if (!res[0].Message) {
          this.coModeList = res;
        }
      },
        error => {
          this.toastr.error("Some Error Occured", "ERROR");
        });
    this.subscribedService.push(coGetService);
  }

  // Function to format date using Angular DatePipe
  formatDate(date: any, format: string): string {
    // Use DatePipe to format the date
    return this.datePipe.transform(date, format);
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

  onFileSelect(event: any, index: number) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    console.log(file);
    
    if (file) {
      const fileNameParts = file.name.split('.');
      const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();
      const allowedExtensions = [
        'pdf',
        'xlsx',
        'jpg',
        'svg',
        'png',
        'jpeg', // Corrected 'jped' to 'jpeg'
        'docx',
        'pptx',
        'txt',
      ];
  
      if (allowedExtensions.includes(fileExtension)) {
        const reader = new FileReader();
        let imageUpload: any = {
          Files: file,
        };
  
        this.ProductionPlanService.productionPlanUploadFile(imageUpload)
          .subscribe((res: any) => {
            if (res.successMessage) {
              reader.onload = () => {
                this.selectedImagesFile = file;
                // Read the file content if needed
                // Patch the form control with the file and its extension
                this.coForms.at(index).patchValue({
                  file: reader.result,
                  fileType: fileExtension,
                  fileName: res.imageName,
                  displayName: res.displayName,
                });
              };
              reader.readAsDataURL(file);
            }
          });
      } else {
        this.toastr.error('Unsupported file type.', 'ERROR');
        // Clear the file input to allow the user to select another file
        fileInput.value = null;
      }
    }
  
    // Reset the file input to allow selecting the same file again
    fileInput.value = '';
  }
  
  

  // After the view has been initialized, set the data source for the table
  ngAfterViewInit() {
    //console.log(this.specData,"Spec data");
    
    if(this.specData){
      this.specForm.controls['specStatus'].setValue(this.specData[0].specId);
      this.specForm.controls['specDate'].setValue(new Date(this.ConvertDate(this.specData[0].specDate)));
      this.specForm.controls['specComment'].setValue(this.specData[0].specComment);
      this.specBgColor = this.specData[0]?.colorCode;
    }
    if(this.bomData){
      console.log(this.bomData , "BOM DATA");
      this.items = this.bomData[0].bomItemDetails;
      this.displayedItems = this.items.slice(0, this.initialLoad);
      this.bomForm.controls['bomStatus'].setValue(this.bomData[0].bomId);
      this.bomForm.controls['bomDate'].setValue(new Date(this.ConvertDate(this.bomData[0].bomDate)));
      this.bomForm.controls['bomComment'].setValue(this.bomData[0].bomComment);
      this.bomBgColor = this.bomData[0]?.colorCode;
    }
    //console.log(this.coData , "CO Data");
    
    if(this.coData){
      this.coData.map((item:any, index:any)=>{
        this.coHeaderColor[index] = item?.colorCode;
        const coForm = this.fb.group({
          coStatus: [item.coId, Validators.required],
          coDate: [new Date(this.ConvertDate(item.coDate)), Validators.required],
          coComment: [item.coComment, Validators.required],
          coMode: [item.CoModeStatusId],
          priority: [item.priority ? item.priority : null],
          fileName: [item.fileName],
          fileType: [item.fileType],
          displayName: [item.displayName],
        });
        this.coForms.push(coForm);
      });
      this.getCoCode();
      console.log(this.coForms.value , "COFORMS");
      
    }else{
      this.addCoForm();
    }
  }

  setStep(index:number){
    this.step = index;
  }

  getFileType(index: number) {
    const field = this.coForms.at(index) as any;
    return field.value.fileType;
  }

  isImageType(fileType: string): boolean {
    return (
      fileType === 'jpg' ||
      fileType === 'png' ||
      fileType === 'svg' ||
      fileType === 'jpeg'
    );
  }

  setCoArray(data:any){
    let newData = data.map((item:any,index:any)=>{
      return{
        ...item,
        coDate:this.ConvertDate(item.coDate)
      }
    });
    //console.log(newData);
    
    return JSON.stringify(newData)
  }

  async saveSpecBomCoData() {
    let data = {
      soNumber: this.soNumber,
      specStatus: this.specForm.value.specStatus,
      specDate: this.ConvertDate(this.specForm.value.specDate),
      specComment: this.specForm.value.specComment?.trim(),
      bomStatus: this.bomForm.value.bomStatus,
      bomDate: this.ConvertDate(this.bomForm.value.bomDate),
      bomComment: this.bomForm.value.bomComment?.trim(),
      coData: this.setCoArray(this.coForms.value),
      tenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      createdBy: this.loginInfo.UserId ? this.loginInfo.UserId : 0,
    };
  
    //console.log(data, "Final Data");
  
    try {
      const res = await this.specService.insertUpdateSpecBomCo(data).toPromise();
    
      const message = res[0]?.SuccessMessage || res[0]?.ErrorMessage;
      const messageType = res[0]?.SuccessMessage ? 'success' : 'error';
    
      if (message) {
        this.toastr[messageType](message, messageType.toUpperCase());
      }
    } catch (error) {
      this.toastr.error("Some Error Occurred", "ERROR");
    }
    
  }

  getCoCode(){
    // console.log(this.coForms.value);
    
    const priority = this.checkPriority();
    const priorityColor = this.coStatusList.find((item:any) => item.priority == priority);
    console.log(priorityColor);
    this.coColorCode = priorityColor?.Colorcode;
  }
  

  async cancelData(){
    await this.ngOnInit();
    this.ngAfterViewInit();
    // this.bomBgColor = "";
    // this.specBgColor = "";
  }

  setStatusColor(color:any, tab:any){
    switch(tab){
      case 'bom':
        this.bomBgColor = color; 
        break; 
      case 'spec':
        this.specBgColor = color; 
        break; 
      default:
        break; 
    }
  }

  // viewPDF(fileName:string, displayName:string,  type:string){
  //   let url = this.base?.pdfView+"Attachments/"+fileName
  //   //console.log(url);
    
  //   const dialogRef = this.dialog.open(PdfImagePreviewComponent, {
  //     width:"80%",
  //     data:{
  //       title:"Preview",
  //       for:type,
  //       link:url,
  //       fileName:fileName,
  //       displayName:displayName
  //     }
  //   })
  // }

  downloadFile(fileName:any, displayName:string){
    //console.log(fileName);
    let newFileName = 'Attachments/'+fileName;
    const downloadFiles = this.ProductionPlanService.SopAttachmentFileDownload(newFileName).subscribe((res:any)=>{
      const blob = new Blob([res], { type: 'application/pdf' });

      // Create a link element and trigger the download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = displayName;
        link.click();
      
    });
  }

  removeFile(index: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width:"30%",
      data:{
        title:"Confirm Action",
        message:"Do you really want to delete the file ?"
      }
    })

    dialogRef.afterClosed().subscribe((result)=>{
      if(result){
        console.log(this.coForms);
        console.log(this.coData);
        
        if(!this.coData || !this.coData[index] || this.coData[index]?.fileName == "null" || this.coData[index]?.fileName == "" ){
          console.log(this.coForms.value);
          this.coForms.value[index].fileName = "";
          this.coForms.value[index].fileType = "";
          console.log(this.coForms.value);
        }else{
          let data = {
            fileName:this.coForms.at(index).value.fileName,
            soNumber:this.soNumber
          }
          const filteDeleteService = this.ProductionPlanService.SopCOFileDelete(data).subscribe((res:any)=>{
            this.toastr.success(res[0].SuccessMessage, "SUCCESS");
            this.coForms.at(index).patchValue({
              fileName: null,
              fileType: null,
            });
            if(this.coData[index]){
              this.coData[index].fileName = "null";
              this.coData[index].fileType = "null";
            }
          })
        }
        
      }
    })
  }

  addEditBomItems(){
    const dialogRef = this.dialog.open(AddEditBomItemsComponent, {
      width: '80%',
      data: {
        title: `${this.items.length > 0 ? "Edit" : "Add"} BOM Items`,
        button: 'Save',
        soNumber:this.soNumber,
        tableData:this.items
      },
      disableClose: true
    });
    dialogRef.afterClosed().toPromise()
      .then((result) => {
        if (result) {
          this.items = result;
          this.displayedItems = this.items.slice(0, this.initialLoad);
        }
      })
      .catch(error => {
        this.toastr.error("Some Error Occured", "ERROR")
      });
  }

}
