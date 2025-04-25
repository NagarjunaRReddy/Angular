import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AxSoDetailsModelComponent } from './ax-so-details-model.component';

describe('AxSoDetailsModelComponent', () => {
  let component: AxSoDetailsModelComponent;
  let fixture: ComponentFixture<AxSoDetailsModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AxSoDetailsModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AxSoDetailsModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
