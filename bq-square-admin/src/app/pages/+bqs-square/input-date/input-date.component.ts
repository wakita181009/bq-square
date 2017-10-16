import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'bqs-input-date',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputDateComponent implements OnInit {
  @Input() data: any;

  constructor() { }

  ngOnInit() {
  }

}
