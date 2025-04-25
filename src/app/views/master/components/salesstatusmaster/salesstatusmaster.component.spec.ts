import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesstatusmasterComponent } from './salesstatusmaster.component';

describe('SalesstatusmasterComponent', () => {
  let component: SalesstatusmasterComponent;
  let fixture: ComponentFixture<SalesstatusmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesstatusmasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesstatusmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
