import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BqsSquareListComponent } from './bqs-square-list.component';

describe('BqsSquareListComponent', () => {
  let component: BqsSquareListComponent;
  let fixture: ComponentFixture<BqsSquareListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BqsSquareListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BqsSquareListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
