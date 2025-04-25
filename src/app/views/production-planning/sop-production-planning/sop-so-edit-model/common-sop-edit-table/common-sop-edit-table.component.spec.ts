import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSopEditTableComponent } from './common-sop-edit-table.component';

describe('CommonSopEditTableComponent', () => {
  let component: CommonSopEditTableComponent;
  let fixture: ComponentFixture<CommonSopEditTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonSopEditTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonSopEditTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
