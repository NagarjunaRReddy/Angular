import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SopSpecReviewComponent } from './sop-spec-review.component';

describe('SopSpecReviewComponent', () => {
  let component: SopSpecReviewComponent;
  let fixture: ComponentFixture<SopSpecReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SopSpecReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SopSpecReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
