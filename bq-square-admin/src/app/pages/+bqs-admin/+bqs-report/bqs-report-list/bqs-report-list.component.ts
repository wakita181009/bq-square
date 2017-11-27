import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk/table';
import {MatSort, MatPaginator} from '@angular/material';

import {IAppState, IModel} from 'app/types';
import {ModelActions} from 'app/store/model/model.actions';


@Component({
  selector: 'bqs-report-list',
  templateUrl: './bqs-report-list.component.html',
  styleUrls: ['./bqs-report-list.component.scss']
})
export class BqsReportListComponent implements OnInit {
  @select(['admin', 'report', 'reloading']) reloading$: Observable<boolean>;

  displayedColumns = ['id', 'name', 'tag', 'order', 'created', 'updated', 'control'];
  report$: BqsReportListDataSource | null;
  @select(['admin', 'report', 'items', 'count']) table_length$: Observable<number>;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @select(['admin', 'report', 'items', 'filter', 'tag']) tagFilterOptions: Observable<string[]>;
  _tagFilterChange = new BehaviorSubject(null);

  get tagFilter(): string[] {
    return this._tagFilterChange.value
  }

  set tagFilter(filter: string[]) {
    this._tagFilterChange.next(filter)
  }

  constructor(public modelActions: ModelActions,
              public store: NgRedux<IAppState>) {
    this.store.dispatch(this.modelActions.listModel('report', {
      limit: '10'
    }));
    this.reloading$
      .filter(v => !v)
      .subscribe(() => {
        this.store.dispatch(this.modelActions.getFilter('report', 'tag'));
      });
  }

  ngOnInit() {
    this.report$ = new BqsReportListDataSource();

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.report$) {
          return;
        }
        this.report$.filter = this.filter.nativeElement.value;
      });

    let filterChanges = [
      this.paginator.page,
      this.sort.sortChange,
      this._tagFilterChange
    ];

    Observable.merge(...filterChanges)
      .subscribe((event) => {
        if (!event) return;
        let options = {};

        let _q = [];
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
        this.store.dispatch(this.modelActions.listModel('report', options))
      });
  }

  del(urlsafe: string) {
    this.store.dispatch(this.modelActions.deleteModel('report', urlsafe));
    this.paginator.pageIndex = 0;
  }

}

class BqsReportListDataSource extends DataSource<IModel[]> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  @select(['admin', 'report', 'items', 'list']) report$: Observable<IModel[]>;

  constructor() {
    super();
  }

  connect(): Observable<IModel[]> {
    const displayDataChanges = [
      this.report$,
      this._filterChange,
    ];

    return Observable.merge(...displayDataChanges)
      .mergeMap(() => this.report$
        .filter(report => !!report)
        .map(report => report.filter(item => {
            let searchStr = (item['id'] + item['name']).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) != -1;
          })
        )
      )
  }

  disconnect() {
  }
}
