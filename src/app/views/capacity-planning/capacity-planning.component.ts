import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CapacityAreaComponent } from './components/capacity-area/capacity-area.component';
import { BucketsComponent } from './components/buckets/buckets.component';
import { SlotsComponent } from './components/slots/slots.component';
import { HelperService } from '../../services/helper.service';
import { StepChangedService } from '../../services/step-changed.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { SaveLayoutService } from './services/save-layout.service';

@Component({
  selector: 'app-capacity-planning',
  templateUrl: './capacity-planning.component.html',
  styleUrls: ['./capacity-planning.component.scss']
})
export class CapacityPlanningComponent implements OnInit, OnDestroy {

  @ViewChild(CapacityAreaComponent) capacityAreaComponent: CapacityAreaComponent;
  @ViewChild(BucketsComponent) bucketComponent: BucketsComponent;
  @ViewChild(SlotsComponent) slotComponent: SlotsComponent;

  capacitySideData: any = ['Capacity Area', 'Buckets', 'Slots'];
  activeData: string = 'Capacity Area';
  previousTab: any;
  bucketData: any;
  slotData: any;
  capacityBreadCrumb: any;
  bucketBreadCrumb: any;
  // slotBreadCrumb: any;

  constructor(
    private helper: HelperService,
    private stepChangeService: StepChangedService,
    private dialog: MatDialog,) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.stepChangeService.setPreviousStep({});
    this.helper.setValue('capacity','');
  }

  BucketEnable(event: any) {
    if (event.value == '1') {
      this.bucketData = JSON.parse(this.helper.getValue("capacity"));
      this.capacityBreadCrumb = event.name;
      this.bucketBreadCrumb = null;
      // this.slotBreadCrumb = null;
    }
    else if (event.value == '0') {
      this.bucketData = JSON.parse(this.helper.getValue("capacity"));
      this.capacityBreadCrumb = null;
      this.bucketBreadCrumb = null;
      // this.slotBreadCrumb = null;
    }
  }

  SlotEnable(event: any) {
    if (event.value == '1') {
      this.slotData = JSON.parse(this.helper.getValue("capacity"));
      if (this.capacityBreadCrumb != null) {
        this.bucketBreadCrumb = event.name;
        // this.slotBreadCrumb = null;
      }
    }
    else if (event.value == '0') {
      this.slotData = JSON.parse(this.helper.getValue("capacity"));
      this.bucketBreadCrumb = null;
      // this.slotBreadCrumb = null;
    }
  }

  setActiveStatus(data: string) {
    this.getPreviousStepDetails();
    let previusInd = this.previousTab.step;
    this.activeData = data;
    switch (previusInd) {
      case 1:
        if (this.previousTab.dataChanged) {
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '30%', // Adjust the width as needed
            data: {
              title: 'Confirm Action',
              message: 'Are you sure want to save capacity changes?',
            },
          });
          dialogRef.afterClosed().subscribe((result) => {
            if (result == true) {
              this.capacityAreaComponent.saveCapacity();
            }
          });
        }
        break;
      case 2:
        if (this.previousTab.dataChanged) {
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '30%', // Adjust the width as needed
            data: {
              title: 'Confirm Action',
              message: 'Are you sure want to save bucket changes?',
            },
          });
          dialogRef.afterClosed().subscribe((result) => {
            if (result == true) {
              this.bucketComponent.saveBucket();
            }
          });
        }
        break;
      case 3:
        if (this.previousTab.dataChanged) {
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '30%', // Adjust the width as needed
            data: {
              title: 'Confirm Action',
              message: 'Are you sure want to save Slot changes?',
            },
          });
          dialogRef.afterClosed().subscribe((result) => {
            if (result == true) {
              this.slotComponent.saveSlot();
            }
          });
        }
        break;
    }
  }
  
  clearFilterValue(opened: any) {
    switch (opened) {
      case 1:
        if (this.capacityAreaComponent && this.capacityAreaComponent.searchInput !== '' && this.capacityAreaComponent.searchInput !== undefined) {
          this.capacityAreaComponent.searchInput = '';
          this.capacityAreaComponent.filterList('')
        }
        break;
      case 2:
        if (this.bucketComponent && this.bucketComponent.searchInput !== '' && this.bucketComponent.searchInput !== undefined) {
          this.bucketComponent.searchInput = '';
          this.bucketComponent.filterList('')
        }
        break;
      case 3:
        if (this.slotComponent && this.slotComponent.searchInput !== '' && this.slotComponent.searchInput !== undefined) {
          this.slotComponent.searchInput = '';
          this.slotComponent.filterList('')
        }
        break;
    }
  }
  

  saveLayout() {
    this.capacityAreaComponent.saveCapacity();
    this.bucketComponent.saveBucket();
    this.slotComponent.saveSlot();
  }

  getPreviousStepDetails() {
    this.stepChangeService.getPreviousStep().subscribe((res: any) => {
      this.previousTab = res;
    });
  }
}
