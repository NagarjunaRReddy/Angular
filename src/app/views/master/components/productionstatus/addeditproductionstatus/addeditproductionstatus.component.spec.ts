import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditproductionstatusComponent } from './addeditproductionstatus.component';

describe('AddeditproductionstatusComponent', () => {
  let component: AddeditproductionstatusComponent;
  let fixture: ComponentFixture<AddeditproductionstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddeditproductionstatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddeditproductionstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
