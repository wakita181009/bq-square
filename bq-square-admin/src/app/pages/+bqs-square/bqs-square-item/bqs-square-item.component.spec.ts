import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BqsSquareItemComponent } from './bqs-square-item.component';

describe('BqsSquareItemComponent', () => {
  let component: BqsSquareItemComponent;
  let fixture: ComponentFixture<BqsSquareItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BqsSquareItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BqsSquareItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
