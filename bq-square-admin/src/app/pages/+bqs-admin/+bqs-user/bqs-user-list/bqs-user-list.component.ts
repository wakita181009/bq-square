import {Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk/table';
import {MatSort, MatPaginator} from '@angular/material';

import {IAppState, IModel} from 'app/types';
import {ModelActions} from 'app/store/model/model.actions';


@Component({
  selector: 'bqs-user-list',
  templateUrl: './bqs-user-list.component.html',
  styleUrls: ['./bqs-user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BqsUserListComponent implements OnInit {
  @select(['admin', 'user', 'reloading']) reloading$: Observable<boolean>;

  displayedColumns = ['name', 'email', 'role', 'control'];
  user$: BqsUserListDataSource | null;
  @select(['admin', 'user', 'items', 'count']) table_length$: Observable<number>;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  _roleFilterChange = new BehaviorSubject(null);

  get roleFilter(): string {
    return this._roleFilterChange.value
  }

  set roleFilter(filter: string) {
    this._roleFilterChange.next(filter)
  }

  constructor(public modelActions: ModelActions,
              public store: NgRedux<IAppState>) {
    this.store.dispatch(this.modelActions.listModel('user', {
      limit: '10'
    }));
  }

  ngOnInit() {
    this.user$ = new BqsUserListDataSource();

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.user$) {
          return;
        }
        this.user$.filter = this.filter.nativeElement.value;
      });

    let filterChanges = [
      this.paginator.page,
      this.sort.sortChange,
      this._roleFilterChange
    ];

    Observable.merge(...filterChanges)
      .subscribe((event) => {
        if (!event) return;
        let options = {};

        let _q = [];
        if (this.roleFilter && this.roleFilter !== 'clear') {
          this.paginator.pageIndex = 0;
          _q.push(`role = '${this.roleFilter}'`);
        }
        options['q'] = _q.join(' AND ');

        if (this.sort.active || this.sort.direction !== '') {
          options['o'] = `${this.sort.direction == 'asc' ? '' : '-'}${this.sort.active}`
        }

        options['offset'] = this.paginator.pageIndex * this.paginator.pageSize;
        options['limit'] = this.paginator.pageSize;
        this.store.dispatch(this.modelActions.listModel('user', options))
      });

  }

  del(urlsafe: string) {
    this.store.dispatch(this.modelActions.deleteModel('user', urlsafe));
    this.paginator.pageIndex = 0;
  }

}


class BqsUserListDataSource extends DataSource<IModel[]> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  @select(['admin', 'user', 'items', 'list']) user$: Observable<IModel[]>;

  constructor() {
    super();
  }

  connect(): Observable<IModel[]> {
    const displayDataChanges = [
      this.user$,
      this._filterChange,
    ];

    return Observable.merge(...displayDataChanges).mergeMap(
      () => this.user$.map(
        user => {
          if (!user) return;
          return user.filter(item => {
            let searchStr = (item['id'] + item['name']).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) != -1;
          })
        }
      )
    )
  }

  disconnect() {
  }
}
