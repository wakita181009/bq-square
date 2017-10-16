import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BqsGlobalKeyEditComponent } from './bqs-global-key-edit.component';

describe('BqsGlobalKeyEditComponent', () => {
  let component: BqsGlobalKeyEditComponent;
  let fixture: ComponentFixture<BqsGlobalKeyEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BqsGlobalKeyEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BqsGlobalKeyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
