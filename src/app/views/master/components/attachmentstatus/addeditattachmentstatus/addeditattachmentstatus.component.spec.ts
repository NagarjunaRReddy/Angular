import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditattachmentstatusComponent } from './addeditattachmentstatus.component';

describe('AddeditattachmentstatusComponent', () => {
  let component: AddeditattachmentstatusComponent;
  let fixture: ComponentFixture<AddeditattachmentstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddeditattachmentstatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddeditattachmentstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
