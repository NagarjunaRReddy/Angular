import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditSpecReviewStatusComponent } from './addedit-spec-review-status.component';

describe('AddeditSpecReviewStatusComponent', () => {
  let component: AddeditSpecReviewStatusComponent;
  let fixture: ComponentFixture<AddeditSpecReviewStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddeditSpecReviewStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddeditSpecReviewStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
