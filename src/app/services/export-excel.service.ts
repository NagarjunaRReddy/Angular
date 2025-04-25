import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as fs from 'file-saver';
//import * as logo from './mylogo.js';

@Injectable({
  providedIn: 'root',
})
export class ExportExcelService {
  constructor(public datepipe: DatePipe) {}

  exportExcel(excelData: any) {
    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers;
    const data = excelData.data;
    const sheetname = excelData.sheetname;
    const excelfilename = excelData.excelfilename;
    const image = excelData.image;
    console.log(data);

    //Create a workbook with a worksheet
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet(sheetname);

    //Add Row and formatting
    worksheet.mergeCells('C1', 'D4');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = title;
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // Date
    // worksheet.mergeCells('G1:H4');
    // let d = new Date();
    // let date = d.getDate() + '-' + d.getMonth + '-' + d.getFullYear();
    // let dateCell = worksheet.getCell('G1');
    // dateCell.value = date;
    // dateCell.font = {
    //   name: 'Calibri',
    //   size: 12,
    //   bold: true
    // }
    // dateCell.alignment = { vertical: 'middle', horizontal: 'center' }

    //Add Image
    // let myLogoImage = workbook.addImage({
    //  // base64: logo.imgBase64,
    //   extension: 'png',
    // });
    // const imageId = workbook.addImage({
    //   filename: image,
    //   extension: 'png',
    // });
    worksheet.mergeCells('A1:B4');
    //worksheet.Insert_image()
    // worksheet.addImage(myLogoImage, 'A1:C4');
    // worksheet.addImage(myLogoImage, {
    //   tl: { col: 0, row: 0 },
    //   ext: { width: 140, height: 70 } // Set the width and height as per the original image dimensions
    // });

    //Blank Row
    worksheet.addRow([]);

    //Adding Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      };
    });

    // Adding Data with Conditional Formatting
    data.forEach((d) => {
      let row = worksheet.addRow(d);
    });
    worksheet.columns.forEach((column, index) => {
      let maxContentWidth = column.header ? column.header.length : 0;

      // Iterate through each cell in the column and calculate maximum content width
      column.eachCell({ includeEmpty: true }, (cell) => {
        if (cell.value !== null && cell.value !== undefined) {
          const cellContentWidth = cell.value.toString().length;
          maxContentWidth = Math.max(maxContentWidth, cellContentWidth);
        }
        cell.alignment = { horizontal: 'center' };
      });
      // Set the column width with additional padding (adjust as needed)
      worksheet.getColumn(index + 1).width = maxContentWidth + 2; // 2 units for padding
    });
    // worksheet.getColumn(1).width = 15;
    // worksheet.getColumn(2).width = 15;
    // worksheet.getColumn(3).width = 15;
    // worksheet.getColumn(4).width = 15;
    // worksheet.getColumn(5).width = 15;
    // worksheet.getColumn(6).width = 15;
    // worksheet.getColumn(7).width = 15;
    // worksheet.getColumn(8).width = 15;
    // worksheet.getColumn(9).width = 15;

    worksheet.addRow([]);
    var date = new Date();
    //Footer Row
    let footerRow = worksheet.addRow([
      'Report Generated On  ' + this.datepipe.transform(date, 'MM-dd-yy'),
    ]);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB050' },
    };

    //Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, excelfilename + '.xlsx');
    });

    // let blob = new Blob(["Hi"], { type: 'application/pdf' });
    //   fs.saveAs(blob, title + '.pdf');
  }

  exportBillOfMaterialExcel(excelData) {
    // Extract necessary data from excelData
    const title = excelData.title;
    const header = excelData.headers;
    const data = excelData.data;
    const sheetname = excelData.sheetname;
    const excelfilename = excelData.excelfilename;
    const customer = excelData.customer; // Assuming customer is an array of values

    // Create a new Excel workbook and worksheet
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet(sheetname);

    //Add Row and formatting
    worksheet.mergeCells('C1', 'E2');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = title;
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    worksheet.getCell('C1').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    //Add Image (Replace 'path/to/your/logo.png' with actual image path or provide a valid base64-encoded image string)
    // let myLogoImage = workbook.addImage({
    //   //base64: logo.imgBase64,
    //   extension: 'png',
    // });
    // worksheet.mergeCells('A1:A2');
    // worksheet.addImage(myLogoImage, 'A1:A2');

    // Add an empty row for spacing
    worksheet.addRow([]);

    // Adding Customer Information Row
    // worksheet.mergeCells('A6', 'B6');
    worksheet.getCell('A6').value = 'Production Order';
    worksheet.getCell('A6').font = { bold: true };
    worksheet.getCell('B6').value = excelData.prodId;

    // worksheet.mergeCells('A7', 'B7');
    worksheet.getCell('A7').value = 'Customer';
    worksheet.getCell('A7').font = { bold: true };
    worksheet.getCell('B7').value = customer;

    // worksheet.mergeCells('A8', 'B8');
    worksheet.getCell('A8').value = 'SO';
    worksheet.getCell('A8').font = { bold: true };
    worksheet.getCell('B8').value = excelData.salesId;

    // worksheet.mergeCells('A9', 'B9');
    worksheet.getCell('A9').value = 'SCCA';
    worksheet.getCell('A9').font = { bold: true };
    worksheet.getCell('B9').value = excelData.configuration;

    // worksheet.mergeCells('A10', 'B10');
    worksheet.getCell('A10').value = 'VIN';
    worksheet.getCell('A10').font = { bold: true };
    worksheet.getCell('B10').value = excelData.vin;

    // worksheet.mergeCells('A11', 'B11');
    worksheet.getCell('A11').value = 'Make';
    worksheet.getCell('A11').font = { bold: true };
    worksheet.getCell('B11').value = excelData.make;

    // worksheet.mergeCells('D6', 'E6');
    worksheet.getCell('D6').value = 'Key Number';
    worksheet.getCell('D6').font = { bold: true };
    worksheet.getCell('E6').value = excelData.keyNumber;

    // worksheet.mergeCells('D7', 'E7');
    worksheet.getCell('D7').value = 'Frame Width';
    worksheet.getCell('D7').font = { bold: true };
    worksheet.getCell('E7').value = excelData.frameWidth;

    // worksheet.mergeCells('D8', 'E8');
    worksheet.getCell('D8').value = 'Model';
    worksheet.getCell('D8').font = { bold: true };
    worksheet.getCell('E8').value = excelData.model;

    // worksheet.mergeCells('D9', 'E9');
    worksheet.getCell('D9').value = 'CA';
    worksheet.getCell('D9').font = { bold: true };
    worksheet.getCell('E9').value = excelData.ca;

    // worksheet.mergeCells('D10', 'E10');
    worksheet.getCell('D10').value = 'YEAR';
    worksheet.getCell('D10').font = { bold: true };
    worksheet.getCell('E10').value = excelData.modelYear;

    // worksheet.mergeCells('D10', 'E10');
    worksheet.getCell('D11').value = 'PRD Start Date';
    worksheet.getCell('D11').font = { bold: true };
    worksheet.getCell('E11').value = excelData.prdStartDate;

    // worksheet.mergeCells('D10', 'E10');
    worksheet.getCell('D12').value = 'PRD Delivery Date';
    worksheet.getCell('D12').font = { bold: true };
    worksheet.getCell('E12').value = excelData.deliveryDate;

    // Add an empty row for spacing
    worksheet.addRow([]);

    // Adding Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      };
    });

    // Add data rows
    data.forEach((d) => {
      worksheet.addRow(d);
    });

    // Set column widths
    worksheet.columns.forEach((column, index) => {
      let maxContentWidth = column.header ? column.header.length : 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        if (cell.value !== null && cell.value !== undefined) {
          const cellContentWidth = cell.value.toString().length;
          maxContentWidth = Math.max(maxContentWidth, cellContentWidth);
        }
        cell.alignment = { horizontal: 'center' };
      });
      // Set the column width with additional padding
      worksheet.getColumn(index + 1).width = maxContentWidth + 2; // 2 units for padding
    });

    // Add footer row
    let date = new Date();
    let footerRow = worksheet.addRow([
      'Report Generated On  ' + this.datepipe.transform(date, 'MM-dd-yy'),
    ]);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB050' },
    };
    worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);
    // Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, excelfilename + '.xlsx');
    });
  }

  exportExcelForProductionPlanning(excelData) {
    // Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers;
    const data = excelData.data;
    const sheetname = excelData.sheetname;
    const excelfilename = excelData.excelfilename;
    const image = excelData.image;

    // Create a workbook with a worksheet
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet(sheetname);

    // Add Row and formatting
    worksheet.mergeCells('D2', 'F4');
    let titleRow = worksheet.getCell('D2');
    titleRow.value = title;
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // Add Image
    // let myLogoImage = workbook.addImage({
    //   //base64: logo.imgBase64,
    //   extension: 'png'
    // });

    // worksheet.mergeCells('A2:B4');
    // worksheet.addImage(myLogoImage, 'A2:B4');

    // Blank Row
    worksheet.addRow([]);

    // Adding Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      };
    });

    // Adding Data with Conditional Formatting
    // Adding Data with Conditional Formatting
    data.forEach((d) => {
      let row = worksheet.addRow([]);

      Object.entries(d).forEach(([key, value], index) => {
        let cell = row.getCell(index + 1);
        let cellValue = value; // Create a new variable to store the cell value without modifying the original value
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } },
        };
        if (value && typeof value === 'string' && value.includes('color:')) {
          const colorRegex = /#([0-9A-Fa-f]{6})/;
          const colorMatch = value.match(colorRegex);
          if (colorMatch && colorMatch[1]) {
            const colorValue = colorMatch[1];
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: colorValue },
              bgColor: { argb: colorValue },
            };
            cell.font = {
              color: { argb: 'FFFFFF' }, // Set font color to white
            };
            cell.border = {
              top: { style: 'thin', color: { argb: '000000' } },
              left: { style: 'thin', color: { argb: '000000' } },
              bottom: { style: 'thin', color: { argb: '000000' } },
              right: { style: 'thin', color: { argb: '000000' } },
            };
            // Remove the "color" property from the cell's value after binding the color
            if (value.includes('| color:')) {
              cellValue = value
                .replace(
                  /(\s*\|\s*color:\s*#[0-9A-Fa-f]{6})|#([0-9A-Fa-f]{6})/,
                  ''
                )
                .trim();
            } else {
              cellValue = value.replace(/color:\s*#[0-9A-Fa-f]{6}/, '').trim();
            }
          }
        }

        // Set the modified cell value to the cell
        cell.value = cellValue;
      });
    });

    console.log(data);

    worksheet.columns.forEach((column, index) => {
      let maxContentWidth = column.header ? column.header.length : 0;

      // Iterate through each cell in the column and calculate maximum content width
      column.eachCell({ includeEmpty: true }, (cell) => {
        if (cell.value !== null && cell.value !== undefined) {
          const cellContentWidth = cell.value.toString().length;
          maxContentWidth = Math.max(maxContentWidth, cellContentWidth);
        }
        cell.alignment = { horizontal: 'center' };
      });
      // Set the column width with additional padding (adjust as needed)
      worksheet.getColumn(index + 1).width = maxContentWidth + 2; // 2 units for padding
    });

    worksheet.addRow([]);
    let date = new Date();
    // Footer Row
    let footerRow = worksheet.addRow([
      'Report Generated On  ' + this.datepipe.transform(date, 'MM-dd-yy'),
    ]);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB050' },
    };

    // Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

    // Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, excelfilename + '.xlsx');
    });
  }

  exportExcelForReports(excelData) {
    // Destructuring excelData
    const { title, headers, data, sheetname, excelfilename, image } = excelData;

    // // Validate base64 image
    // if (!image || !this.isValidBase64(image)) {
    //   console.error('Invalid base64 image input.');
    //   return;
    // }

    // Create a workbook with a worksheet
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet(sheetname);

    // Add Row and formatting for title
    worksheet.mergeCells('D1', 'H4');
    let titleRow = worksheet.getCell('D1');
    titleRow.value = title;
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

    //Add Image
    // let myLogoImage = workbook.addImage({
    //   //base64: logo.imgBase64,
    //   extension: 'png',
    // });
    // worksheet.mergeCells('A1:C4');
    // worksheet.addImage(myLogoImage, 'A1:C4');

    // Blank Row
    worksheet.addRow([]);

    // Adding Header Row
    let headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      };
    });

    // Adding Data with Conditional Formatting
    data.forEach((d) => {
      let row = worksheet.addRow(d);

      if (sheetname == 'DeliverDateDelta') {
        // Conditional formatting for AXDeliveryDate and SandopDeliveryDate
        let axDeliveryDate = row.getCell(4).value;
        let sandopDeliveryDate = row.getCell(5).value;
        if (
          this.ConvertDate(axDeliveryDate) !=
          this.ConvertDate(sandopDeliveryDate)
        ) {
          row.eachCell({ includeEmpty: true }, (cell) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'ffb54c' }, // color for the entire row
            };
            cell.border = {
              top: { style: 'thin', color: { argb: '000000' } },
              left: { style: 'thin', color: { argb: '000000' } },
              bottom: { style: 'thin', color: { argb: '000000' } },
              right: { style: 'thin', color: { argb: '000000' } },
            };
          });
        }
      }

      if (sheetname == 'SiteDelta') {
        // Conditional formatting for AXDeliveryDate and SandopDeliveryDate
        let axSite = row.getCell(2).value;
        let sandopSite = row.getCell(3).value;
        if (axSite != sandopSite) {
          row.eachCell({ includeEmpty: true }, (cell) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'ffb54c' }, // color for the entire row
            };
            cell.border = {
              top: { style: 'thin', color: { argb: '000000' } },
              left: { style: 'thin', color: { argb: '000000' } },
              bottom: { style: 'thin', color: { argb: '000000' } },
              right: { style: 'thin', color: { argb: '000000' } },
            };
          });
        }
      }
    });

    // Adjust column widths and alignment
    worksheet.columns.forEach((column, index) => {
      let maxContentWidth = column.header ? column.header.length : 0;

      column.eachCell({ includeEmpty: true }, (cell) => {
        if (cell.value !== null && cell.value !== undefined) {
          const cellContentWidth = cell.value.toString().length;
          maxContentWidth = Math.max(maxContentWidth, cellContentWidth);
        }
        cell.alignment = { horizontal: 'center' };
      });

      worksheet.getColumn(index + 1).width = maxContentWidth + 2;
    });

    // Blank Row
    worksheet.addRow([]);

    // Footer Row
    let date = new Date();
    let footerRow = worksheet.addRow([
      'Report Generated On ' + this.datepipe.transform(date, 'MM-dd-yy'),
    ]);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB050' },
    };
    worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

    // Generate & Save Excel File
    workbook.xlsx
      .writeBuffer()
      .then((data) => {
        let blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        fs.saveAs(blob, excelfilename + '.xlsx');
      })
      .catch((error) => {
        console.error('Error generating Excel file:', error);
      });
  }

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
}
