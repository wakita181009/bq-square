import {Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk/table';
import {MatSort, MatPaginator} from '@angular/material';

import {IAppState, IModel} from 'app/types';
import {ModelActions} from 'app/store/model/model.actions';


@Component({
  selector: 'bqs-global-key-list',
  templateUrl: './bqs-global-key-list.component.html',
  styleUrls: ['./bqs-global-key-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BqsGlobalKeyListComponent implements OnInit {
  @select(['admin', 'global_key', 'reloading']) reloading$: Observable<boolean>;

  displayedColumns = ['id', 'display_name', 'type', 'created', 'updated', 'control'];
  global_key$: BqsGlobalKeyListDataSource | null;
  @select(['admin', 'global_key', 'items', 'count']) table_length$: Observable<number>;

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
    this.store.dispatch(this.modelActions.listModel('global_key', {
      limit: '10'
    }));
  }

  ngOnInit() {
    this.global_key$ = new BqsGlobalKeyListDataSource();

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.global_key$) {
          return;
        }
        this.global_key$.filter = this.filter.nativeElement.value;
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
        this.store.dispatch(this.modelActions.listModel('global_key', options))
      });

  }

  del(urlsafe: string) {
    this.store.dispatch(this.modelActions.deleteModel('global_key', urlsafe));
    this.paginator.pageIndex = 0;
  }

}


class BqsGlobalKeyListDataSource extends DataSource<IModel[]> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  @select(['admin', 'global_key', 'items', 'list']) global_key$: Observable<IModel[]>;

  constructor() {
    super();
  }

  connect(): Observable<IModel[]> {
    const displayDataChanges = [
      this.global_key$,
      this._filterChange,
    ];

    return Observable.merge(...displayDataChanges).mergeMap(
      () => this.global_key$.map(global_key => {
          if (!global_key) return;
          return global_key.filter(item => {
            let searchStr = (item['id'] + item['display_name']).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) != -1;
          })
        }
      )
    )
  }

  disconnect() {
  }
}
