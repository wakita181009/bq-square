import {Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk/table';

import {IAppState, IModel} from 'app/types';
import {ModelActions} from 'app/store/model/model.actions';
import {createModelLoadingSelector} from 'app/selectors/model';

@Component({
  selector: 'bqs-user-list',
  templateUrl: './bqs-user-list.component.html',
  styleUrls: ['./bqs-user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BqsUserListComponent implements OnInit {
  displayedColumns = ['name', 'email', 'role', 'control'];

  @ViewChild('filter') filter: ElementRef;

  user$: BqsUserListDataSource | null;
  @select(createModelLoadingSelector('user')) loading: Observable<boolean>;

  constructor(public modelActions: ModelActions,
              public store: NgRedux<IAppState>) {
    this.store.dispatch(this.modelActions.listModel('user'));
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

  }

  del(urlsafe: string) {
    this.store.dispatch(this.modelActions.deleteModel('user', urlsafe));
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

  @select(['admin', 'user', 'items']) user$: Observable<IModel[]>;

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
