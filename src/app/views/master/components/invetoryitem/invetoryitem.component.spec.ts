import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvetoryitemComponent } from './invetoryitem.component';

describe('InvetoryitemComponent', () => {
  let component: InvetoryitemComponent;
  let fixture: ComponentFixture<InvetoryitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvetoryitemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvetoryitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
