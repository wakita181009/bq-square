import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk/table';

import {IAppState, IModel} from 'app/types';
import {ModelActions} from 'app/store/model/model.actions';
import {createModelLoadingSelector} from 'app/selectors/model';


@Component({
  selector: 'bqs-query-list',
  templateUrl: './bqs-query-list.component.html',
  styleUrls: ['./bqs-query-list.component.scss'],
})
export class BqsQueryListComponent implements OnInit {
  displayedColumns = ['id', 'name', 'data_source_id', 'cache', 'created', 'updated', 'control'];

  @ViewChild('filter') filter: ElementRef;

  query$: BqsQueryListDataSource | null;
  @select(createModelLoadingSelector('query')) loading: Observable<boolean>;

  constructor(public modelActions: ModelActions,
              public store: NgRedux<IAppState>) {
    this.store.dispatch(this.modelActions.listModel('query'));
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

  constructor() {
    super();
  }

  connect(): Observable<IModel[]> {
    const displayDataChanges = [
      this.query$,
      this._filterChange,
    ];

    return Observable.merge(...displayDataChanges).mergeMap(
      () => this.query$.map(query => {
          if (!query) return;
          return query.filter(item => {
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

