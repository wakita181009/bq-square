import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BqsQueryEditComponent } from './bqs-query-edit.component';

describe('BqsQueryEditComponent', () => {
  let component: BqsQueryEditComponent;
  let fixture: ComponentFixture<BqsQueryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BqsQueryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BqsQueryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
