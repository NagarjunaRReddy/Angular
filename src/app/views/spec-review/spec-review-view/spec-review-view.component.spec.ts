import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecReviewViewComponent } from './spec-review-view.component';

describe('SpecReviewViewComponent', () => {
  let component: SpecReviewViewComponent;
  let fixture: ComponentFixture<SpecReviewViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecReviewViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecReviewViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
