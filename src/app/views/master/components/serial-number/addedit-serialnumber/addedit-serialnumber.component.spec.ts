import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditSerialnumberComponent } from './addedit-serialnumber.component';

describe('AddeditSerialnumberComponent', () => {
  let component: AddeditSerialnumberComponent;
  let fixture: ComponentFixture<AddeditSerialnumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddeditSerialnumberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddeditSerialnumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
