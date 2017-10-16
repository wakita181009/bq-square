import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BqsReportListComponent } from './bqs-report-list.component';

describe('BqsReportListComponent', () => {
  let component: BqsReportListComponent;
  let fixture: ComponentFixture<BqsReportListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BqsReportListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BqsReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
