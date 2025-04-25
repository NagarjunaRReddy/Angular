import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesresposibleComponent } from './salesresposible.component';

describe('SalesresposibleComponent', () => {
  let component: SalesresposibleComponent;
  let fixture: ComponentFixture<SalesresposibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesresposibleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesresposibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
