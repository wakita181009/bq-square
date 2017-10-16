import {Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk/table';

import {IAppState, IModel} from 'app/types';
import {ModelActions} from 'app/store/model/model.actions';
import {createModelLoadingSelector} from 'app/selectors/model';


@Component({
  selector: 'bqs-bqs-global-key-list',
  templateUrl: './bqs-global-key-list.component.html',
  styleUrls: ['./bqs-global-key-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BqsGlobalKeyListComponent implements OnInit {

  displayedColumns = ['id', 'display_name', 'type', 'created', 'updated', 'control'];

  @ViewChild('filter') filter: ElementRef;

  global_key$: BqsGlobalKeyListDataSource | null;
  @select(createModelLoadingSelector('global_key')) loading: Observable<boolean>;

  constructor(public modelActions: ModelActions,
              public store: NgRedux<IAppState>) {
    this.store.dispatch(this.modelActions.listModel('global_key'));
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

  }

  del(urlsafe: string) {
    this.store.dispatch(this.modelActions.deleteModel('global_key', urlsafe));
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

  @select(['admin', 'global_key', 'items']) global_key$: Observable<IModel[]>;

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
