import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionresponsibleComponent } from './actionresponsible.component';

describe('ActionresponsibleComponent', () => {
  let component: ActionresponsibleComponent;
  let fixture: ComponentFixture<ActionresponsibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActionresponsibleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionresponsibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
