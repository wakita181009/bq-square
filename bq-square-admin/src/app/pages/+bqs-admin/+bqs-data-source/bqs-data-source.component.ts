import {Component, OnInit} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {MatSnackBar} from '@angular/material';

import {IAppState} from 'app/types';
import {ModelActions} from 'app/store/model/model.actions';
import {createModelLoadingSelector} from 'app/selectors/model';

@Component({
  selector: 'bqs-data-source',
  template: `
<mat-progress-bar *ngIf="loading$ | async" mode="indeterminate"></mat-progress-bar>
<router-outlet></router-outlet>
`
})
export class BqsDataSourceComponent implements OnInit {
  @select(createModelLoadingSelector('data_source')) loading$: Observable<boolean>;
  @select(['admin', 'data_source', 'error']) error$: Observable<string>;
  @select(['admin', 'data_source', 'message']) message$: Observable<string>;

  constructor(public snackBar: MatSnackBar,
              public modelActions: ModelActions,
              public store: NgRedux<IAppState>) {
  }

  ngOnInit() {
    this.error$
      .filter(err => !!err)
      .subscribe(err => {
        this.snackBar.open(err, 'close', {
          duration: 3000,
        });
        this.store.dispatch(this.modelActions.clearError('data_source'))
      });
    this.message$
      .filter(msg => !!msg)
      .subscribe(msg => {
        this.snackBar.open(msg, 'close', {
          duration: 3000,
        });
        this.store.dispatch(this.modelActions.clearMessage('data_source'))
      })
  }
}
