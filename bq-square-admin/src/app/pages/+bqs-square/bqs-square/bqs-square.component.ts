import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs';

import {IAppState, ISquareItem} from 'app/types';
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
  @select(['square', 'active', 'items']) square_items$: Observable<ISquareItem[]>;

  constructor(public store: NgRedux<IAppState>,
              public squareActions: SquareActions,
              public route: ActivatedRoute) {
  }

  ngOnInit() {

    this.route.paramMap
      .subscribe((params: ParamMap) => {
        this.store.dispatch(this.squareActions.squareChanged());
        this.store.dispatch(this.squareActions.readSquare(params.get('urlsafe') || ''));
        this.store.dispatch(this.squareActions.listSquare());
      });
  }

}
