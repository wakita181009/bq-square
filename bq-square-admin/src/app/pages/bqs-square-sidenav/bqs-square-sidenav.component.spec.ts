import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BqsSquareSidenavComponent } from './bqs-square-sidenav.component';

describe('BqsSquareSidenavComponent', () => {
  let component: BqsSquareSidenavComponent;
  let fixture: ComponentFixture<BqsSquareSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BqsSquareSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BqsSquareSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
