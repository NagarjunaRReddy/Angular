import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditdrawingstatusComponent } from './addeditdrawingstatus.component';

describe('AddeditdrawingstatusComponent', () => {
  let component: AddeditdrawingstatusComponent;
  let fixture: ComponentFixture<AddeditdrawingstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddeditdrawingstatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddeditdrawingstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
