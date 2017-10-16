import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BqsGlobalKeyListComponent } from './bqs-global-key-list.component';

describe('BqsGlobalKeyListComponent', () => {
  let component: BqsGlobalKeyListComponent;
  let fixture: ComponentFixture<BqsGlobalKeyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BqsGlobalKeyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BqsGlobalKeyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
