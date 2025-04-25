import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecReviewStatusComponent } from './spec-review-status.component';

describe('SpecReviewStatusComponent', () => {
  let component: SpecReviewStatusComponent;
  let fixture: ComponentFixture<SpecReviewStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpecReviewStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecReviewStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
