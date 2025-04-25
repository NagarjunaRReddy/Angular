import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from '../../../../services/helper.service';
import { BucketsService } from '../../services/buckets.service';
import { DatePipe, JsonPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { BucketPlanningInsertSelect } from '../../interfaces/buckets';
import _moment, { default as _rollupMoment, Moment } from 'moment';
const moment = _rollupMoment || _moment;
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-add-edit-buckets',
  templateUrl: './add-edit-buckets.component.html',
  styleUrl: './add-edit-buckets.component.scss',
})
export class AddEditBucketsComponent {
  addEditForm!: FormGroup;
  selectedStartDate: Date | null = null;
  submittedForm: boolean = false;
  submittedGeneral: boolean = false;
  loginInfo: any;
  subscribedService: Subscription[] = [];
  selectedDays: Set<string> = new Set(new Set([]));
  selectedMonths: Set<string> = new Set<string>([]);
  weekRanges: {
    start: Date;
    end: Date;
    startWeekNumber: number;
    endWeekNumber: number;
  }[] = [];
  capacity: any;
  businessunitId: any;

  constructor(
    public dialogRef: MatDialogRef<AddEditBucketsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private helper: HelperService,
    private bucketService: BucketsService,
    // private dateService: DateService,
    private datePipe: DatePipe
  ) {}
  /// Define the date filter function
  endDateFilter = (date: Date | null): boolean => {
    // Check if date is null
    if (date === null) {
      return false; // or true, depending on your logic
    }

    // Ensure the start date is defined
    if (!this.selectedStartDate) {
      return true; // Allow all dates if start date is not set
    }

    // Disable dates that are before the selected start date
    return date >= this.selectedStartDate;
  };
  // Update selectedStartDate when start_date changes
  onStartDateChange(date: Date | null): void {
    // Set selectedStartDate to the new date
    this.selectedStartDate = date;

    // Check if the date is null before comparing it with the end date
    const endDateValue = this.addEditForm.controls['end_date'].value;
    this.addEditForm.controls['end_date'].enable();
    if (date && endDateValue) {
      // Ensure both dates are not null
      if (endDateValue < date) {
        this.addEditForm.controls['end_date'].setValue(null); // Clear end date if it's before start date
      }
    }
  }

  validateEndDate(control: AbstractControl): { [key: string]: boolean } | null {
    const startDate = this.addEditForm.get('start_date')?.value;
    const endDate = control.value;

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      return { endDateInvalid: true }; // Return an error if End Date is earlier
    }
    return null; // No error
  }

  ngOnInit(): void {
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo') || '{}');
    this.capacity = JSON.parse(this.helper.getValue('Capacity'));
    this.businessunitId = JSON.parse(this.helper.getValue('UserBusinessId'));
    console.log(this.loginInfo, 'logininfo');
    this.addEditForm = this.fb.group({
      timePeriod: this.capacity,

      start_date: [null, Validators.required],
      end_date: [null, Validators.required],
      exclude_days: ['', Validators.pattern(/^\d+(,\d+)*$/)], // Comma-separated list of numbers
      note_Name: [''],
    });

    this.addEditForm.controls['end_date'].disable();

    this.addEditForm
      .get('end_date')
      ?.setValidators(this.validateEndDate.bind(this));
    // Call generateWeekRanges initially if form values are already present
    this.generateWeekRanges();

    // Listen for form changes
    this.addEditForm.get('start_date')?.valueChanges.subscribe(() => {
      this.generateWeekRanges();
    });

    this.addEditForm.get('end_date')?.valueChanges.subscribe(() => {
      this.generateWeekRanges();
    });

    if (this.data.value) {
      console.log(this.data.value, 'this.data.value');
      this.addEditForm.controls['start_date'].setValue(
        this.data.value.StartDate
      );
      this.addEditForm.controls['end_date'].setValue(this.data.value.EndDate);
      this.selectedDays.add(this.data.value.Exclude);
      console.log(this.data.value.Exclude, 'this.data.value.Exclude');
      //this.addEditForm.controls['note_Name'].setValue(this.data.value.WeekNumber);

      const weekNumber = this.data.value.WeekNumber; // Get the week number
      const currentYear = new Date(
        this.data.value.FormattedDates
      ).getFullYear(); // Extract year from FormattedDates

      // Create the formatted string
      const formattedWeekString = `Week ${weekNumber} - ${currentYear}`;

      // Set the value in the form control
      if (this.capacity == 'Daily') {
        this.addEditForm.controls['note_Name'].setValue(formattedWeekString);
      } else if (this.capacity === 'Weekly' || this.capacity === 'Monthly') {
        // Use the DatePipe to format dates in dd-MM-yyyy format
        const datePipe = new DatePipe('en-US'); // Adjust locale if needed

        const formattedStartDate = datePipe.transform(
          this.data.value.StartDate,
          'MM-dd-yyyy'
        );
        const formattedEndDate = datePipe.transform(
          this.data.value.EndDate,
          'MM-dd-yyyy'
        );

        const weekrange = `${formattedStartDate} To ${formattedEndDate}`;
        this.addEditForm.controls['note_Name'].setValue(weekrange);

        console.log(weekrange, 'this.data.value.FormattedDates');
      }
    }
    this.convertDateformate();
  }

  convertDateformate() {
    if (this.capacity == 'Monthly' && this.data.value) {
      const date = this.addEditForm.controls['note_Name'].value.split('To');
      const fromDate = date[0].trim();
      const ToDate = date[1].trim();
      const formattedDatefromDate = this.datePipe.transform(
        fromDate,
        'MM-yyyy'
      );
      const formattedDateToDate = this.datePipe.transform(ToDate, 'MM-yyyy');
      this.addEditForm.controls['note_Name'].setValue(
        `Week ${formattedDatefromDate} To  Week ${formattedDateToDate}`
      );
    }
  }

  generateWeekRanges(): void {
    const startDateValue = this.addEditForm.controls['start_date'].value;
    const endDateValue = this.addEditForm.controls['end_date'].value;

    // Convert to Date objects if they are valid strings
    const startDate = startDateValue ? new Date(startDateValue) : null;
    const endDate = endDateValue ? new Date(endDateValue) : null;

    if (startDate && endDate) {
      const startWeekNumber = this.getWeekNumber(startDate);
      const endWeekNumber = this.getWeekNumber(endDate);

      this.weekRanges = [
        {
          start: startDate,
          end: endDate,
          startWeekNumber: startWeekNumber,
          endWeekNumber: endWeekNumber,
        },
      ];
    } else {
      this.weekRanges = [];
    }
  }

  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  ngOnDestroy(): void {
    this.subscribedService.forEach((element) => {
      element.unsubscribe();
    });
  }

  onSave(): void {
    if (this.addEditForm.invalid) {
      this.submittedForm = true;
      return;
    } else {
      this.submittedForm = false;
    }
    console.log(this.data.value, 'this.data.value');
    console.log(
      this.data.value?.BucketPlanningDaysWeekMonthId,
      'this.data.value'
    );
    this.submittedGeneral = true;
    console.log(this.selectedDays), 'console.log(this.selectedDays)';
    const transformedStartDate = this.datePipe.transform(
      this.addEditForm.controls['start_date'].value,
      'yyyy-MM-dd'
    );
    const transformedEndDate = this.datePipe.transform(
      this.addEditForm.controls['end_date'].value,
      'yyyy-MM-dd'
    );

    // Log to check the transformed values
    console.log('Transformed Start Date:', transformedStartDate);
    console.log('Transformed End Date:', transformedEndDate);

    const bucketData: BucketPlanningInsertSelect = {
      StartDate: transformedStartDate
        ? new Date(transformedStartDate)
        : undefined,
      EndDate: transformedEndDate ? new Date(transformedEndDate) : undefined,
      Flag:
        this.capacity === 'Weekly'
          ? 2
          : this.capacity === 'Daily'
          ? 1
          : this.capacity === 'Monthly'
          ? 3
          : 0,
      BuId: this.businessunitId,
      Exclude: this.getSelectedDaysAsString(),

      CreatedBy: this.loginInfo.CreatedBy ? this.loginInfo.CreatedBy : 0,
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      ModifiedBy: this.loginInfo.CreatedBy ? this.loginInfo.CreatedBy : 0,
    };
    if (this.capacity == 'Daily') {
      if (bucketData.Exclude.length == 13) {
        this.toastr.warning('Please choose a Day Atleast');
        return;
      }
    }

    // Log the data being sent
    console.log('Sending Bucket Data:', bucketData);

    const bucketInsertService = this.bucketService
      .BucketSelect(bucketData)
      .subscribe(
        (res: any) => {
          console.log(res, 'res');

          if (res.Table[0].Success) {
            this.toastr.success(res.Table[0].Success, 'Success');
          } else {
            this.toastr.error(res.Table[0].Error, 'Error');
          }
          this.dialogRef.close(true);
        },
        (error: any) => {
          this.toastr.error('Please Select End Date', 'ERROR');
          console.error('Error:', error); // Log the actual error
        }
      );

    this.subscribedService.push(bucketInsertService);
  }

  onCancel(): void {
    this.dialogRef.close(''); // Return 'false' to indicate cancellation.
  }

  toggleDay(day: string) {
    if (this.selectedDays.has(day)) {
      this.selectedDays.delete(day);
    } else {
      this.selectedDays.add(day);
    }
  }

  isDaySelected(day: string): boolean {
    console.log(this.selectedDays);
    return this.selectedDays.has(day); // For a Set
  }

  private getSelectedDaysAsString(): string {
    let result: string[] = [];

    // Include selected days if they are a Set
    if (this.selectedDays instanceof Set) {
      result.push(...Array.from(this.selectedDays)); // Convert Set to Array and add to result
    } else {
      console.log(this.selectedDays, 'selectedDays');
      result.push(this.selectedDays); // If it is already an Array or string
    }

    // Include selected months if they are a Set
    if (this.selectedMonths instanceof Set) {
      result.push(...Array.from(this.selectedMonths)); // Convert Set to Array and add to result
    }

    return result.join(','); // Join all selected days and months into a single string
  }

  // Function to check if a month is selected
  isMonthSelected(month: string): boolean {
    return this.selectedMonths.has(month); // Check directly with the string
  }

  // Function to toggle a month selection
  toggleMonth(month: string): void {
    if (this.selectedMonths.has(month)) {
      this.selectedMonths.delete(month); // If already selected, unselect it
    } else {
      this.selectedMonths.add(month); // If not selected, select it
    }
  }

  //this function close date picker after month select
  setMonthAndYear(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.addEditForm.controls['start_date'].value;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.addEditForm.controls['start_date'].setValue(ctrlValue);
    datepicker.close();
  }

  setEndMonthAndYear(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.addEditForm.controls['end_date'].value;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.addEditForm.controls['end_date'].setValue(ctrlValue);
    datepicker.close();
  }
}
