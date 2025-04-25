import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditsiteComponent } from './addeditsite.component';

describe('AddeditsiteComponent', () => {
  let component: AddeditsiteComponent;
  let fixture: ComponentFixture<AddeditsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddeditsiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddeditsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
