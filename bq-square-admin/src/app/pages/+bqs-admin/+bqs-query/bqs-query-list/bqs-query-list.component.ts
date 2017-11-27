import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk/collections';
import {MatSort, MatPaginator} from '@angular/material';

import {IAppState, IModel} from 'app/types';
import {ModelActions} from 'app/store/model/model.actions';


@Component({
  selector: 'bqs-query-list',
  templateUrl: './bqs-query-list.component.html',
  styleUrls: ['./bqs-query-list.component.scss'],
})
export class BqsQueryListComponent implements OnInit {
  @select(['admin', 'report', 'reloading']) reloading$: Observable<boolean>;

  displayedColumns = ['id', 'name', 'data_source_id', 'cache', 'created', 'updated', 'control'];
  query$: BqsQueryListDataSource | null;
  @select(['admin', 'query', 'items', 'count']) table_length$: Observable<number>;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @select(['admin', 'query', 'items', 'filter', 'data_source_id']) dataSourceIdFilterOptions: Observable<string[]>;
  _dataSourceIdFilterChange = new BehaviorSubject(null);

  get dataSourceIdFilter(): string[] {
    return this._dataSourceIdFilterChange.value
  }

  set dataSourceIdFilter(filter: string[]) {
    this._dataSourceIdFilterChange.next(filter);
  }

  @select(['admin', 'query', 'items', 'filter', 'tag']) tagFilterOptions: Observable<string[]>;
  _tagFilterChange = new BehaviorSubject(null);

  get tagFilter(): string[] {
    return this._tagFilterChange.value
  }

  set tagFilter(filter: string[]) {
    this._tagFilterChange.next(filter)
  }


  constructor(public modelActions: ModelActions,
              public store: NgRedux<IAppState>) {
    this.store.dispatch(this.modelActions.listModel('query', {
      limit: '10'
    }));

    this.reloading$
      .filter(v => !v)
      .subscribe(() => {
        this.store.dispatch(this.modelActions.getFilter('query', 'tag'));
        this.store.dispatch(this.modelActions.getFilter('query', 'data_source_id'));
      });
  }

  ngOnInit() {
    this.query$ = new BqsQueryListDataSource();

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.query$) {
          return;
        }
        this.query$.filter = this.filter.nativeElement.value;
      });

    let filterChanges = [
      this.paginator.page,
      this.sort.sortChange,
      this._dataSourceIdFilterChange,
      this._tagFilterChange
    ];

    Observable.merge(...filterChanges)
      .subscribe((event) => {
        if (!event) return;
        let options = {};

        let _q = [];
        if (this.dataSourceIdFilter && this.dataSourceIdFilter.length > 0) {
          this.paginator.pageIndex = 0;
          _q.push(`data_source_id in ('${this.dataSourceIdFilter.join("','")}')`);
        }
        if (this.tagFilter && this.tagFilter.length > 0) {
          this.paginator.pageIndex = 0;
          _q.push(`tag in ('${this.tagFilter.join("','")}')`);
        }
        options['q'] = _q.join(' AND ');

        if (this.sort.active || this.sort.direction !== '') {
          options['o'] = `${this.sort.direction == 'asc' ? '' : '-'}${this.sort.active}`
        }

        options['offset'] = this.paginator.pageIndex * this.paginator.pageSize;
        options['limit'] = this.paginator.pageSize;
        this.store.dispatch(this.modelActions.listModel('query', options))
      });
  }

  del(urlsafe: string) {
    this.store.dispatch(this.modelActions.deleteModel('query', urlsafe));
    this.paginator.pageIndex = 0;
  }

}

class BqsQueryListDataSource extends DataSource<IModel[]> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  @select(['admin', 'query', 'items', 'list']) query$: Observable<IModel[]>;

  constructor() {
    super();
  }

  connect(): Observable<IModel[]> {
    const displayDataChanges = [
      this.query$,
      this._filterChange,
    ];

    return Observable.merge(...displayDataChanges)
      .mergeMap(() => this.query$
        .filter(query => !!query)
        .map(query => query.filter(item => {
            let searchStr = (item['id'] + item['name']).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) != -1;
          })
        )
      )
  }

  disconnect() {
  }
}

