import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[bqs-square-item-host]',
})
export class BqsSquareItemHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}
