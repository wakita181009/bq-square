import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BqsDataSourceListComponent } from './bqs-data-source-list.component';

describe('BqsDataSourceListComponent', () => {
  let component: BqsDataSourceListComponent;
  let fixture: ComponentFixture<BqsDataSourceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BqsDataSourceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BqsDataSourceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
