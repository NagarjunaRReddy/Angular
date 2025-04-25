import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigPartsComponent } from './big-parts.component';

describe('BigPartsComponent', () => {
  let component: BigPartsComponent;
  let fixture: ComponentFixture<BigPartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BigPartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BigPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
