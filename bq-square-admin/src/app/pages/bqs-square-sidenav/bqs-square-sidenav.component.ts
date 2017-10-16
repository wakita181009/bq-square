import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material';

import {IAppState, ISquare} from 'app/types';
import {squareLoadingSelector} from 'app/selectors/square';
import {SquareActions} from 'app/store/square/square.actions';


@Component({
  selector: 'bqs-square-sidenav',
  templateUrl: './bqs-square-sidenav.component.html',
  styleUrls: ['./bqs-square-sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BqsSquareSidenavComponent implements OnInit {
  @select(['square', 'items']) square_items$: Observable<ISquare[]>;
  @select(['square', 'active']) square$: Observable<ISquare>;
  @select(squareLoadingSelector) loading$: Observable<boolean>;
  @select(['square', 'error']) square_error$: Observable<any>;

  constructor(public snackBar: MatSnackBar,
              public store: NgRedux<IAppState>,
              public squareActions: SquareActions) {
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'close', {
      duration: 3000,
    });
  }

  ngOnInit() {
    setTimeout(() => this.square_error$
      .subscribe(
        err => {
          if (err) this.openSnackBar(err)
        }
      ))

  }

  run_query() {
    this.store.dispatch(this.squareActions.runAllQuery());
  }

}
