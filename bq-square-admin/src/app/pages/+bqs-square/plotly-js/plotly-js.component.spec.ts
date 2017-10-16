import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotlyJsComponent } from './plotly-js.component';

describe('PlotlyJsComponent', () => {
  let component: PlotlyJsComponent;
  let fixture: ComponentFixture<PlotlyJsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlotlyJsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotlyJsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
