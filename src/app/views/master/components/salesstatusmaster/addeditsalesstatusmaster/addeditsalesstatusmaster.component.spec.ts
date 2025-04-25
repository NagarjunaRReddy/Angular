import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditsalesstatusmasterComponent } from './addeditsalesstatusmaster.component';

describe('AddeditsalesstatusmasterComponent', () => {
  let component: AddeditsalesstatusmasterComponent;
  let fixture: ComponentFixture<AddeditsalesstatusmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddeditsalesstatusmasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddeditsalesstatusmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
