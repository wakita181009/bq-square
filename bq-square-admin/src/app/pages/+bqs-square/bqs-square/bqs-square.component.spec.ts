import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BqsSquareComponent } from './bqs-square.component';

describe('BqsSquareComponent', () => {
  let component: BqsSquareComponent;
  let fixture: ComponentFixture<BqsSquareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BqsSquareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BqsSquareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
