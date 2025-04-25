import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBucketsComponent } from './add-edit-buckets.component';

describe('AddEditBucketsComponent', () => {
  let component: AddEditBucketsComponent;
  let fixture: ComponentFixture<AddEditBucketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditBucketsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditBucketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
