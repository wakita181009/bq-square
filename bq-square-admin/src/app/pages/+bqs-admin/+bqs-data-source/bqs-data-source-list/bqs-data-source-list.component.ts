import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk/table';

import {IAppState, IModel} from 'app/types';
import {ModelActions} from 'app/store/model/model.actions';
import {createModelLoadingSelector} from 'app/selectors/model';


@Component({
  selector: 'bqs-data-source-list',
  templateUrl: './bqs-data-source-list.component.html',
  styleUrls: ['./bqs-data-source-list.component.scss']
})
export class BqsDataSourceListComponent implements OnInit {
  displayedColumns = ['id', 'type', 'control'];

  @ViewChild('filter') filter: ElementRef;

  data_source$: BqsDataSourceListDataSource | null;
  @select(createModelLoadingSelector('data_source')) loading: Observable<boolean>;

  constructor(public modelActions: ModelActions,
              public store: NgRedux<IAppState>) {
    this.store.dispatch(this.modelActions.listModel('data_source'));
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

  }

  del(urlsafe: string) {
    this.store.dispatch(this.modelActions.deleteModel('data_source', urlsafe));
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

  @select(['admin', 'data_source', 'items']) data_source$: Observable<IModel[]>;

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
