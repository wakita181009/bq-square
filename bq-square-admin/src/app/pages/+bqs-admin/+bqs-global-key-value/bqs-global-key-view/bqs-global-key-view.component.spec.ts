import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BqsGlobalKeyViewComponent } from './bqs-global-key-view.component';

describe('BqsGlobalKeyViewComponent', () => {
  let component: BqsGlobalKeyViewComponent;
  let fixture: ComponentFixture<BqsGlobalKeyViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BqsGlobalKeyViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BqsGlobalKeyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
