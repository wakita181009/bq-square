import {Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk/collections';
import {MatSnackBar, MatSort} from '@angular/material';

import {IAppState, ISquare} from 'app/types';
import {squareLoadingSelector} from 'app/selectors/square';
import {SquareActions} from 'app/store/square/square.actions';


@Component({
  selector: 'bqs-square-list',
  templateUrl: './bqs-square-list.component.html',
  styleUrls: ['./bqs-square-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BqsSquareListComponent implements OnInit {
  @select(squareLoadingSelector) loading$: Observable<boolean>;
  @select(['square', 'error']) square_error$: Observable<any>;

  displayedColumns = ['id', 'name', 'control'];
  square_items$: BqsSquareListDataSource | null;
  @select(['square', 'items', 'count']) table_length$: Observable<number>;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public snackBar: MatSnackBar,
              public store: NgRedux<IAppState>,
              public squareActions: SquareActions) {
    this.store.dispatch(this.squareActions.listSquare());
  }

  ngOnInit() {
    this.square_items$ = new BqsSquareListDataSource();

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.square_items$) {
          return;
        }
        this.square_items$.filter = this.filter.nativeElement.value;
      });

    let filterChanges = [
      this.sort.sortChange,
    ];

    Observable.merge(...filterChanges)
      .subscribe((event) => {
        if (!event) return;
        let options = {};

        if (this.sort.active || this.sort.direction !== '') {
          options['o'] = `${this.sort.direction == 'asc' ? '' : '-'}${this.sort.active}`
        }

        this.store.dispatch(this.squareActions.listSquare(options))
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

}


class BqsSquareListDataSource extends DataSource<ISquare> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  @select(['square', 'items', 'list']) square_items$: Observable<ISquare[]>;

  constructor() {
    super();
  }

  connect(): Observable<ISquare[]> {
    const displayDataChanges = [
      this.square_items$,
      this._filterChange,
    ];

    return Observable.merge(...displayDataChanges)
      .mergeMap(() => this.square_items$
        .filter(s => !!s)
        .map(s => s.filter(item => {
            let searchStr = (item['id'] + item['name']).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) != -1;
          })
        )
      )
  }

  disconnect() {
  }

}
