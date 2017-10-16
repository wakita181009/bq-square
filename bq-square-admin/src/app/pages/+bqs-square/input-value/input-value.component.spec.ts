import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputValueComponent } from './input-value.component';

describe('InputValueComponent', () => {
  let component: InputValueComponent;
  let fixture: ComponentFixture<InputValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
