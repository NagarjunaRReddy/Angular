import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentstatusComponent } from './attachmentstatus.component';

describe('AttachmentstatusComponent', () => {
  let component: AttachmentstatusComponent;
  let fixture: ComponentFixture<AttachmentstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttachmentstatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachmentstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
