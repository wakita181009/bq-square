import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk/table';
import {MatSort, MatPaginator} from '@angular/material';

import {IAppState, IModel} from 'app/types';
import {ModelActions} from 'app/store/model/model.actions';


@Component({
  selector: 'bqs-data-source-list',
  templateUrl: './bqs-data-source-list.component.html',
  styleUrls: ['./bqs-data-source-list.component.scss']
})
export class BqsDataSourceListComponent implements OnInit {
  @select(['admin', 'data_source', 'reloading']) reloading$: Observable<boolean>;

  displayedColumns = ['id', 'type', 'created', 'updated', 'control'];
  data_source$: BqsDataSourceListDataSource | null;
  @select(['admin', 'data_source', 'items', 'count']) table_length$: Observable<number>;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  _typeFilterChange = new BehaviorSubject(null);

  get typeFilter(): string {
    return this._typeFilterChange.value
  }

  set typeFilter(filter: string) {
    this._typeFilterChange.next(filter)
  }

  constructor(public modelActions: ModelActions,
              public store: NgRedux<IAppState>) {
    this.store.dispatch(this.modelActions.listModel('data_source', {
      limit: '10'
    }));
  }

  ngOnInit() {
    this.data_source$ = new BqsDataSourceListDataSource();

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.data_source$) {
          return;
        }
        this.data_source$.filter = this.filter.nativeElement.value;
      });

    let filterChanges = [
      this.paginator.page,
      this.sort.sortChange,
      this._typeFilterChange
    ];

    Observable.merge(...filterChanges)
      .subscribe((event) => {
        if (!event) return;
        let options = {};

        let _q = [];
        if (this.typeFilter && this.typeFilter !== 'clear') {
          this.paginator.pageIndex = 0;
          _q.push(`type = '${this.typeFilter}'`);
        }
        options['q'] = _q.join(' AND ');

        if (this.sort.active || this.sort.direction !== '') {
          options['o'] = `${this.sort.direction == 'asc' ? '' : '-'}${this.sort.active}`
        }

        options['offset'] = this.paginator.pageIndex * this.paginator.pageSize;
        options['limit'] = this.paginator.pageSize;
        this.store.dispatch(this.modelActions.listModel('data_source', options))
      });

  }

  del(urlsafe: string) {
    this.store.dispatch(this.modelActions.deleteModel('data_source', urlsafe));
    this.paginator.pageIndex = 0;
  }

}


class BqsDataSourceListDataSource extends DataSource<IModel[]> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  @select(['admin', 'data_source', 'items', 'list']) data_source$: Observable<IModel[]>;

  constructor() {
    super();
  }

  connect(): Observable<IModel[]> {
    const displayDataChanges = [
      this.data_source$,
      this._filterChange,
    ];

    return Observable.merge(...displayDataChanges).mergeMap(
      () => this.data_source$.map(data_source => {
          if (!data_source) return;
          return data_source.filter(item => {
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
