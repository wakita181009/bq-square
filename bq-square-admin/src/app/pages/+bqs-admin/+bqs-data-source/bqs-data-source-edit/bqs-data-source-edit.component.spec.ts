import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BqsDataSourceEditComponent } from './bqs-data-source-edit.component';

describe('BqsDataSourceEditComponent', () => {
  let component: BqsDataSourceEditComponent;
  let fixture: ComponentFixture<BqsDataSourceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BqsDataSourceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BqsDataSourceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
