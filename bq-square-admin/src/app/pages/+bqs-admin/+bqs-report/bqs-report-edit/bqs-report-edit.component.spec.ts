import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BqsReportEditComponent } from './bqs-report-edit.component';

describe('BqsReportEditComponent', () => {
  let component: BqsReportEditComponent;
  let fixture: ComponentFixture<BqsReportEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BqsReportEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BqsReportEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
