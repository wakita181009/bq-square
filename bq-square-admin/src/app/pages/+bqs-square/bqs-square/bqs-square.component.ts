import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {select, NgRedux} from '@angular-redux/store';
import {MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs';

import {IAppState, ISquareItem, ISquare} from 'app/types';
import {SquareActions} from 'app/store/square/square.actions';
import {squareLoadingSelector} from 'app/selectors/square';


@Component({
  selector: 'bqs-square',
  templateUrl: './bqs-square.component.html',
  styleUrls: ['./bqs-square.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BqsSquareComponent implements OnInit {

  @select(squareLoadingSelector) loading$: Observable<boolean>;
  @select(['square', 'active', 'run']) run$: Observable<boolean>;
  @select(['square', 'active', 'urlsafe']) square_active_urlsafe$: Observable<string>;
  @select(['square', 'active', 'items']) square_active_items$: Observable<ISquareItem[]>;

  @select(['square', 'items']) square_items$: Observable<ISquare[]>;
  @select(['square', 'active']) square$: Observable<ISquare>;
  @select(['square', 'error']) square_error$: Observable<any>;

  constructor(public snackBar: MatSnackBar,
              public store: NgRedux<IAppState>,
              public squareActions: SquareActions,
              public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.store.dispatch(this.squareActions.squareChanged());

    Observable.combineLatest(
      this.route.paramMap.map((params: ParamMap) => params.get('urlsafe')),
      this.square_active_urlsafe$.take(1)
    ).subscribe(arr => {
      this.store.dispatch(this.squareActions.readSquare(arr[0] || arr[1] || ''));
    });

    setTimeout(() => this.square_error$
      .subscribe(
        err => {
          if (err) this.openSnackBar(err)
        }
      ))

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'close', {
      duration: 3000,
    });
  }

  run_query() {
    this.store.dispatch(this.squareActions.runAllQuery());
  }


}
