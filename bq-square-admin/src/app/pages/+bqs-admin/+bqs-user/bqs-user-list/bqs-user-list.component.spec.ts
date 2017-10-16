import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BqsUserListComponent } from './bqs-user-list.component';

describe('BqsUserListComponent', () => {
  let component: BqsUserListComponent;
  let fixture: ComponentFixture<BqsUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BqsUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BqsUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
