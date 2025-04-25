import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SopAttachmentsComponent } from './sop-attachments.component';

describe('SopAttachmentsComponent', () => {
  let component: SopAttachmentsComponent;
  let fixture: ComponentFixture<SopAttachmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SopAttachmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SopAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
