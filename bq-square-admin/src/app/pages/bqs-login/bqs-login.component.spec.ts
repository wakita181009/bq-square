import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BqsLoginComponent } from './bqs-login.component';

describe('BqsLoginComponent', () => {
  let component: BqsLoginComponent;
  let fixture: ComponentFixture<BqsLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BqsLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BqsLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
