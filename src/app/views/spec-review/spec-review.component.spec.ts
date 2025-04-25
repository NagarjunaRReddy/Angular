import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecReviewComponent } from './spec-review.component';

describe('SpecReviewComponent', () => {
  let component: SpecReviewComponent;
  let fixture: ComponentFixture<SpecReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
