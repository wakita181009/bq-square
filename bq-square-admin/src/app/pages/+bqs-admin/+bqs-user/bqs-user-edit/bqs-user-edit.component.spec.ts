import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BqsUserEditComponent } from './bqs-user-edit.component';

describe('BqsUserEditComponent', () => {
  let component: BqsUserEditComponent;
  let fixture: ComponentFixture<BqsUserEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BqsUserEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BqsUserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
