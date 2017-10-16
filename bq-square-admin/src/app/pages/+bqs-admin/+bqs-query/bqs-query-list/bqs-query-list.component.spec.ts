import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BqsQueryListComponent } from './bqs-query-list.component';

describe('BqsQueryListComponent', () => {
  let component: BqsQueryListComponent;
  let fixture: ComponentFixture<BqsQueryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BqsQueryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BqsQueryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
