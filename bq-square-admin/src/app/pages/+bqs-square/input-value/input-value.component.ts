import {Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs';

import {IAppState, IGlobal} from 'app/types';
import {SquareActions} from 'app/store/square/square.actions';

@Component({
  selector: 'bqs-input-value',
  templateUrl: './input-value.component.html',
  styleUrls: ['./input-value.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputValueComponent implements OnInit {
  @Input() data: any;
  ready: boolean = false;
  item$: Observable<IGlobal>;
  item: IGlobal;
  item_subscription;

  constructor(public store: NgRedux<IAppState>,
              public squareActions: SquareActions,
              public changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    if (this.data.format) {
      let connect_id = this.data.format['connect'];
      if (connect_id) {
        this.store.dispatch(this.squareActions.getGlobalKeyValue(connect_id));
        this.item$ = this.store.select(['square', 'global', connect_id]);
        this.item_subscription = this.item$.subscribe(item => {
          if (item) {
            this.ready = true;
            this.item = item;
            this.changeDetector.detectChanges();
          }
        })
      }
    }
  }

  ngOnDestroy() {
    this.item_subscription && this.item_subscription.unsubscribe();
  }

}
