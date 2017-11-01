import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk/collections';
import {MatSort} from '@angular/material';

import {IAppState, IModel} from 'app/types';
import {ModelActions} from 'app/store/model/model.actions';


@Component({
  selector: 'bqs-query-list',
  templateUrl: './bqs-query-list.component.html',
  styleUrls: ['./bqs-query-list.component.scss'],
})
export class BqsQueryListComponent implements OnInit {
  displayedColumns = ['id', 'name', 'data_source_id', 'cache', 'created', 'updated', 'control'];

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  query$: BqsQueryListDataSource | null;

  constructor(public modelActions: ModelActions,
              public store: NgRedux<IAppState>) {
    this.store.dispatch(this.modelActions.listModel('query'));
  }

  ngOnInit() {
    this.query$ = new BqsQueryListDataSource(this.sort);

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.query$) {
          return;
        }
        this.query$.filter = this.filter.nativeElement.value;
      });

  }

  del(urlsafe: string) {
    this.store.dispatch(this.modelActions.deleteModel('query', urlsafe));
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

  @select(['admin', 'query', 'items']) query$: Observable<IModel[]>;

  constructor(private _sort: MatSort) {
    super();
  }

  connect(): Observable<IModel[]> {
    const displayDataChanges = [
      this.query$,
      this._filterChange,
      this._sort.sortChange,
    ];

    return Observable.merge(...displayDataChanges).mergeMap(
      () => this.query$.map(query => {
          if (!query) return;
          let _data = query.filter(item => {
            let searchStr = (item['id'] + item['name']).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) != -1;
          });
          return this.getSortedData(_data)
        }
      )
    )
  }

  getSortedData(_data: IModel[]): IModel[] {
    const data = _data.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string|boolean = '';
      let propertyB: number|string|boolean = '';

      switch (this._sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'data_source_id': [propertyA, propertyB] = [a.data_source_id, b.data_source_id]; break;
        case 'cache': [propertyA, propertyB] = [a.cache, b.cache]; break;
        case 'created': [propertyA, propertyB] = [a.created, b.created]; break;
        case 'updated': [propertyA, propertyB] = [a.updated, b.updated]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }

  disconnect() {
  }
}

