import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { HelperService } from '../../../../../services/helper.service';
import { BaseService } from '../../../../../base/base.service';
import { ProductionPlanningService } from '../../../services/production-planning.service';
import { DrawingStatusService } from '../../../services/drawing-status.service';
import { ConfirmDialogComponent } from '../../../../../shared/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-sop-drawing',
  templateUrl: './sop-drawing.component.html',
  styleUrls: ['./sop-drawing.component.scss']
})
export class SopDrawingComponent implements OnInit {
  $unsubscribe = new Subject<any>()
  @Input() soNumber: any;
  @Input() panView: any;
  @Input() commonTableData: any;
  @Input() drawingDetails: any;
  @Input() attachmentAndDrawingStatus: any;
  dynamicForm: FormGroup;
  drawingStatusForm: FormGroup;
  selectedImagesFile: File | null = null;
  loginInfo: any;
  drawingStatusList: any[]=[];
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private helper: HelperService,
    public base: BaseService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private ProductionPlanService: ProductionPlanningService,
    private drawingStatusService: DrawingStatusService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);
    
    if (changes['drawingDetails']) {
      this.ngOnInit();
    }
  }

  ngOnInit(): void {
    this.drawingStatusForm = this.formBuilder.group({
      documentStatus:[0],
      drawingDate:[null],
      comments:[''],
    })
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
    this.dynamicForm = this.formBuilder.group({
      fields: this.formBuilder.array([]),
    });
    if(this.drawingDetails.length != 0 && this.drawingDetails){
      this.bindDrawingData();
    }else{
      this.addField(null,null,null,null,null,null,null);
    }
    this.getDrawingStatusData();
  }

  
  getDrawingStatusData() {

    const drawingStatusData: any = {
      drawingStatusId: 0,
      tenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    }

    const drawingStatusGetService = this.drawingStatusService.getDrawingStatus(drawingStatusData)
      .subscribe((res: any) => {
        if (!res[0].Message) {
          this.drawingStatusList = res;
        }
      },
        error => {
          this.toastr.error("Some Error Occured", "ERROR");
        });
  }


  // Helper method to get the fields control as FormArray
  get fields(): FormArray {
    return this.dynamicForm.get('fields') as FormArray;
  }

  bindDrawingData(){
    //console.log(this.attachmentAndDrawingStatus);
    
    this.drawingStatusForm.controls['documentStatus'].setValue(this.attachmentAndDrawingStatus[0].drawingStatus?this.attachmentAndDrawingStatus[0].drawingStatus:'')
    this.drawingStatusForm.controls['drawingDate'].setValue(this.attachmentAndDrawingStatus[0]?.drawingDate)
    this.drawingStatusForm.controls['comments'].setValue(this.attachmentAndDrawingStatus[0].drawingComment)
    this.drawingDetails.forEach((item)=>{
      this.addField(item.description,item.revisionId, item.attachDate, null, item.fileType, item.fileName, item.displayName);
    })
  }

  addField(description: string,revisionId:any, attachDate:any, file: File | null, fileType: string, fileName: string, displayName:string) {
    const newField = this.createField(description, revisionId, attachDate, file, fileType, fileName, displayName);
    this.fields.push(newField);
  }

  createField(description: string = '',revisionId:any, attachDate:any, file: File | null = null, fileType: string = '', fileName: string = '', displayName:string = '') {
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
    const fileInput = event.target;
    const file = event.target.files[0];
    console.log(file);
    
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
        let imageUpload: any = {
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
        const filteDeleteService = this.ProductionPlanService.SopDrawingFileDelete(data).subscribe((res:any)=>{
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
    console.log(this.dynamicForm.value, 'Dynamic Form Value');
    let newFieldsData = this.dynamicForm.value.fields.map((field) => {
      return {
        fileName: field.fileName,
        description: field.description ? field.description : '',
        fileType: field.fileType,
        revisionId: field.revisionId,
        attachmentDate: this.ConvertDate(field.attachDate),
        displayName:field.displayName
      };
    });
    let data: any = {
      soNumber: this.soNumber,
      json: JSON.stringify(newFieldsData),
      tenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      createdby: this.loginInfo.UserId ? this.loginInfo.UserId : 0,
      drawingStatus:this.drawingStatusForm.value.documentStatus || 0,
      drawingComments:this.drawingStatusForm.value.comments,
      drawingDate:this.ConvertDate(this.drawingStatusForm.value.drawingDate),
      flag:"Drawing"
    };


    const InsertSopAttachments =
      this.ProductionPlanService.InsertSopDrawing(data).pipe(takeUntil(this.$unsubscribe)).subscribe({
        next: (res:any) => {
            //console.log(res);
            this.toastr.success(
              res[0].SuccessMessage ? res[0].SuccessMessage : '',
              'SUCCESS'
            );
        },
        error:(error:Error) => {
          this.toastr.error(error.message, 'ERROR');
        }
      });
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

  // viewPDF(fileName:string, displayName:string, type:string){
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
