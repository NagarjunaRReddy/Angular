import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditactionresponsibleComponent } from './addeditactionresponsible.component';

describe('AddeditactionresponsibleComponent', () => {
  let component: AddeditactionresponsibleComponent;
  let fixture: ComponentFixture<AddeditactionresponsibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddeditactionresponsibleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddeditactionresponsibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
