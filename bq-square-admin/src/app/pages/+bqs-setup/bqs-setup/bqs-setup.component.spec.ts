import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BqsSetupComponent } from './bqs-setup.component';

describe('BqsSetupComponent', () => {
  let component: BqsSetupComponent;
  let fixture: ComponentFixture<BqsSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BqsSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BqsSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
