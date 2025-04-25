import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaliseViewComponent } from './personalise-view.component';

describe('PersonaliseViewComponent', () => {
  let component: PersonaliseViewComponent;
  let fixture: ComponentFixture<PersonaliseViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonaliseViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonaliseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
