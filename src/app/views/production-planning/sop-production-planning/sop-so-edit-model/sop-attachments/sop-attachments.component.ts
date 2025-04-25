import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from '../../../../../services/helper.service';
import { BaseService } from '../../../../../base/base.service';
import { ProductionPlanningService } from '../../../services/production-planning.service';
import { AttachmentStatusService } from '../../../services/attachment-status.service';
import { IproductionplanAttachmentFileUplod } from '../../../interfaces/production-sop';
import { ConfirmDialogComponent } from '../../../../../shared/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-sop-attachments',
  templateUrl: './sop-attachments.component.html',
  styleUrls: ['./sop-attachments.component.scss'],
})
export class SopAttachmentsComponent implements OnInit {
  @Input() soNumber: any;
  @Input() panView: any;
  @Input() commonTableData: any;
  @Input() attachmentDetails: any;
  @Input() attachmentAndDrawingStatus: any;
  dynamicForm: FormGroup;
  attachmentStatusForm: FormGroup;
  selectedImagesFile: File | null = null;
  loginInfo: any;
  attachmentStatusList: any[]=[];
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private helper: HelperService,
    public base: BaseService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private ProductionPlanService: ProductionPlanningService,
    private attachmentService:AttachmentStatusService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);
    
    if (changes['attachmentDetails']) {
      this.ngOnInit();
    }
  }

  ngOnInit(): void {
    //console.log(this.attachmentDetails);
    this.attachmentStatusForm = this.formBuilder.group({
      documentStatus:[0],
      documentDate:[null],
      comments:['']
    })
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
    this.dynamicForm = this.formBuilder.group({
      fields: this.formBuilder.array([]),
    });
    if(this.attachmentDetails.length != 0 && this.attachmentDetails){
      this.bindAttachmentData();
    }else{
      this.addField(null,null,null,null,null,null, null);
    }
    this.getAttachmentStatus();
  }

  // Helper method to get the fields control as FormArray
  get fields(): FormArray {
    return this.dynamicForm.get('fields') as FormArray;
  }

  bindAttachmentData(){
    this.attachmentStatusForm.controls['documentStatus'].setValue(this.attachmentAndDrawingStatus[0]?.attachmentStatus || 0)
    this.attachmentStatusForm.controls['documentDate'].setValue(this.attachmentAndDrawingStatus[0]?.attachmentDate)
    this.attachmentStatusForm.controls['comments'].setValue(this.attachmentAndDrawingStatus[0]?.attachmentComment)
    this.attachmentDetails.forEach((item)=>{
      this.addField(item.description,item.revisionId, item.attachDate, null, item.fileType, item.fileName, item.displayName);
    })
  }

  getAttachmentStatus(){
    const attachmentData: any = {
      AttachmentStatusId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    }

    const attachmentGetService = this.attachmentService.getAttachmentStatus(attachmentData)
      .subscribe((res: any) => {
        if (!res[0].Message) {
          //console.log(res , "ABCD");
          
          this.attachmentStatusList = res;
        }
      },
        error => {
          this.toastr.error("Some Error Occured", "ERROR");
        });
  }

  addField(description: string,revisionId:any, attachDate:any, file: File | null, fileType: string, fileName: string, displayName:string) {
    const newField = this.createField(description, revisionId, attachDate, file, fileType, fileName, displayName);
    this.fields.push(newField);
  }

  createField(description: string = '',revisionId:any, attachDate:any, file: File | null = null, fileType: string = '', fileName: string = '', displayName: string = '') {
    return this.formBuilder.group({
      description: [description, Validators.required],
      revisionId: [revisionId, Validators.required],
      attachDate: [attachDate ? new Date(attachDate) : null, Validators.required],
      file: [file],
      fileType: [fileType],
      fileName: [fileName],
      displayName: [displayName],
    });
  }

  removeField(index: number) {
    this.fields.removeAt(index);
  }

  onFileSelect(event: any, index: number) {
    const file = event.target.files[0];
    const fileInput = event.target;
    if (file) {
      const fileNameParts = file.name.split('.');
      const fileExtension =
        fileNameParts[fileNameParts.length - 1].toLowerCase();
      const allowedExtensions = [
        'pdf',
        'xlsx',
        'jpg',
        'svg',
        'png',
        'jped',
        'docx',
        'pptx',
        'txt',
      ]; // Add 'xlsx' to allowed file extensions

      if (allowedExtensions.includes(fileExtension)) {
        const reader = new FileReader();
        let imageUpload: IproductionplanAttachmentFileUplod = {
          Files: file,
        };

        this.ProductionPlanService.productionPlanUploadFile(
          imageUpload
        ).subscribe((res: any) => {
          //console.log(res);
          if (res.successMessage) {
            reader.onload = () => {
              this.selectedImagesFile = file;
              // Read the file content if needed
              // Patch the form control with the file and its extension
              this.fields.at(index).patchValue({
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
        // alert('Unsupported file type.');
        // Clear the file input to allow the user to select another file
        event.target.value = null;
        fileInput.value = null;
      }
    }

    fileInput.value = '';
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
        let data = {
          fileName:this.fields.at(index).value.fileName,
          soNumber:this.soNumber
        }
        const filteDeleteService = this.ProductionPlanService.SopAttachmentFileDelete(data).subscribe((res:any)=>{
          this.toastr.success(res[0].SuccessMessage, "SUCCESS");
          this.fields.at(index).patchValue({
            file: null,
            fileType: null,
          });
        })
      }
    })
  }

  isImageType(fileType: string): boolean {
    return (
      fileType === 'jpg' ||
      fileType === 'png' ||
      fileType === 'svg' ||
      fileType === 'jpeg'
    );
  }

  cancelChange() {
    this.ngOnInit();
  }

  getFileType(index: number) {
    const field = this.fields.at(index) as any;
    return field.value.fileType;
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
  

  onSubmit() {
    //console.log(this.dynamicForm.value, 'Dynamic Form Value');
    let newFieldsData = this.dynamicForm.value.fields.map((field) => {
      return {
        fileName: field.fileName,
        description: field.description ? field.description : '',
        fileType: field.fileType,
        attachmentDate:this.ConvertDate(field.attachDate),
        revisionId:field.revisionId,
        displayName:field.displayName
      };
    });
    //console.log(newFieldsData);
    
    let data: any = {
      soNumber: this.soNumber,
      json: JSON.stringify(newFieldsData),
      tenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      createdby: this.loginInfo.UserId ? this.loginInfo.UserId : 0,
      attachmentStatus:this.attachmentStatusForm.value.documentStatus,
      attachmentComments:this.attachmentStatusForm.value.comments,
      attachmentDate:this.attachmentStatusForm.value.documentDate ? this.ConvertDate(this.attachmentStatusForm.value.documentDate) : null,
      flag:"Attachment"
    };

    const InsertSopAttachments =
      this.ProductionPlanService.InsertSopAttachments(data).subscribe(
        (res: any) => {
          //console.log(res);
          this.toastr.success(
            res[0].SuccessMessage ? res[0].SuccessMessage : '',
            'SUCCESS'
          );
        },
        (error) => {
          this.toastr.error('Something went wrong!', 'ERROR');
        }
      );
  }

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

}
