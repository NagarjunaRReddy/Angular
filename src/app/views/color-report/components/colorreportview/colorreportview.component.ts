import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';

import { Subscription } from 'rxjs';
import { HelperService } from '../../../../services/helper.service';
import { DatePipe } from '@angular/common';
import { ExportExcelService } from '../../../../services/export-excel.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColorreportService } from '../../services/colorreport.service';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-colorreportview',
  templateUrl: './colorreportview.component.html',
  styleUrl: './colorreportview.component.scss',
})
export class ColorreportviewComponent {
  @ViewChild('content', { static: false }) content: ElementRef;

  loginInfo: any;
  subscribedService: Subscription[] = [];
  prodId: any;
  ca: any;
  listData: any;
  vin: any;
  salesId: any;
  modelYear: any;
  model: any;
  make: any;
  keyNumber: any;
  itemName: any;
  itemId: any;
  inventSerialId: any;
  frameWidth: any;
  customer: any;
  configuration: any;
  dataForExcel: any[];
  dataSource: any;
  deliveryDate: any;
  prdStartDate: any;
  prodDeliveryDate: any;
  prodStartDate: any;

  constructor(
    private colorService: ColorreportService,
    private helper: HelperService,
    private datepipe: DatePipe,
    private excelService: ExportExcelService,
    private toastr: ToastrService,
    private exportExcelService: ExportExcelService,
    public dialogRef: MatDialogRef<ColorreportviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
    if (this.data.prodId != null && this.data.prodId != undefined) {
      this.loadBomData(this.data.prodId);
      this.prodDeliveryDate = this.data.prodDeliveryDate;
      this.prodStartDate = this.data.prodStartDate;
    }
  }

  ngOnDestroy(): void {
    this.subscribedService.forEach((element) => {
      element.unsubscribe();
    });
  }

  loadBomData(prodId: any) {
    const BomService = this.colorService
      .getBomLineDataListWithParamAsync(prodId)
      .subscribe(
        (res: any) => {
          const result = JSON.parse(res);
          this.ca = result[0].CA;
          this.configuration = result[0].configuration;
          this.customer = result[0].customer;
          this.frameWidth = result[0].FrameWidth;
          this.inventSerialId = result[0].inventSerialId;
          this.itemId = result[0].ItemId;
          this.itemName = result[0].ItemName;
          this.keyNumber = result[0].KeyNumber;
          this.make = result[0].Make;
          this.model = result[0].Model;
          this.modelYear = result[0].ModelYear;
          this.prodId = result[0].ProdId;
          this.salesId = result[0].SalesId;
          this.vin = result[0].vin;
          this.deliveryDate = result[0].deliveryDate;
          this.prdStartDate = result[0].prdStartDate;
          // this.listData = JSON.parse(result[0].listData).response;
          this.listData = JSON.parse(result[0].listData);
          this.dataSource = this.listData;
        },
        (error) => {
          this.toastr.error(`An error occurred: ${error.message}`, 'ERROR');
        }
      );
    this.subscribedService.push(BomService);
  }

  onCancel() {
    this.dialogRef.close();
  }
  //** For Downloading the PDF */
  public SavePDF(): void {
    const pdfTable = this.content.nativeElement;

    html2canvas(pdfTable, { scale: 1.5, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/jpeg', 0.5); // Use JPEG & compression
      const imgWidth = 210; // A4 width (210mm - 4mm for 2px padding on both sides)
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
      let heightLeft = imgHeight;

      const doc = new jsPDF('p', 'mm', 'a4', true);
      let position = 4; // Start position (top padding of 2mm)

      // Add first page with padding
      doc.addImage(
        imgData,
        'JPEG',
        2,
        position,
        imgWidth,
        imgHeight,
        '',
        'FAST'
      );
      heightLeft -= pageHeight;

      // Add extra pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight; // Move to next page
        doc.addPage();
        doc.addImage(
          imgData,
          'JPEG',
          2,
          position,
          imgWidth,
          imgHeight,
          '',
          'FAST'
        );
        heightLeft -= pageHeight;
      }

      doc.save(this.prodId + '.pdf'); // Save with product ID
    });
  }
  //** convering Date format */
  ConvertDate(date: any): string {
    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return ''; // Return empty string if the date is invalid
      }

      const cdate = this.datepipe.transform(parsedDate, 'MM/dd/yy');
      if (cdate === '01/01/00' || cdate === '01/01/01' || cdate === null) {
        return '';
      } else {
        return cdate;
      }
    } else {
      return '';
    }
  }
  //** For Downloading the Excel */
  SaveExcel(): void {
    let currentDateTime = this.datepipe.transform(
      new Date(),
      'MM/dd/yyyy h:mm:ss'
    );

    this.dataForExcel = [];

    this.dataSource.forEach((row: any) => {
      let exceldata = {
        ['Item ID']: row.itemId,
        ['Item Name']: row.itemName,
        ['Qty']: row.Qty,
        ['Opr Num']: row.oprNum,
        ['Inventory Status']: row.inventStatus,
      };
      this.dataForExcel.push(Object.values(exceldata));
    });
    let exceldisplayColumns = [
      'Item ID',
      'Item Name',
      'Qty',
      'Opr Num',
      'Inventory Status',
    ];

    let reportData = {
      image: 'assets/images/Fouts-Fire.png',
      title: 'Color Report - BOM',
      ca: this.ca,

      configuration: this.configuration,
      customer: this.customer,
      frameWidth: this.frameWidth,
      inventSerialId: this.inventSerialId,
      itemId: this.itemId,
      itemName: this.itemName,
      keyNumber: this.keyNumber,
      make: this.make,
      model: this.model,
      modelYear: this.modelYear,
      prodId: this.prodId,
      salesId: this.salesId,
      vin: this.vin,
      data: this.dataForExcel,
      prdStartDate: this.ConvertDate(this.data.prodStartDate),
      deliveryDate: this.ConvertDate(this.data.prodDeliveryDate),
      headers: exceldisplayColumns,
      excelfilename: 'Color Report BOM' + currentDateTime,
      sheetname: 'Color Report-BOM',
    };

    if (
      this.dataForExcel != undefined &&
      this.dataForExcel != null &&
      this.dataForExcel.length > 0
    )
      this.excelService.exportBillOfMaterialExcel(reportData);
    else this.toastr.error('No data to display');
  }
}
