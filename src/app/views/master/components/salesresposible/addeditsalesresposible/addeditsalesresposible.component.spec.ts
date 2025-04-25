import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditsalesresposibleComponent } from './addeditsalesresposible.component';

describe('AddeditsalesresposibleComponent', () => {
  let component: AddeditsalesresposibleComponent;
  let fixture: ComponentFixture<AddeditsalesresposibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddeditsalesresposibleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddeditsalesresposibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
