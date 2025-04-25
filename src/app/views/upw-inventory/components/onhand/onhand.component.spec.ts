import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnhandComponent } from './onhand.component';

describe('OnhandComponent', () => {
  let component: OnhandComponent;
  let fixture: ComponentFixture<OnhandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnhandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnhandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
