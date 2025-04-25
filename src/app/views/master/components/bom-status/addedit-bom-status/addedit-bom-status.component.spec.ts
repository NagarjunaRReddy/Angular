import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditBomStatusComponent } from './addedit-bom-status.component';

describe('AddeditBomStatusComponent', () => {
  let component: AddeditBomStatusComponent;
  let fixture: ComponentFixture<AddeditBomStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddeditBomStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddeditBomStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
