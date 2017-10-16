import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk/table';

import {IAppState, IModel} from 'app/types';
import {ModelActions} from 'app/store/model/model.actions';
import {createModelLoadingSelector} from 'app/selectors/model';


@Component({
  selector: 'bqs-report-list',
  templateUrl: './bqs-report-list.component.html',
  styleUrls: ['./bqs-report-list.component.scss']
})
export class BqsReportListComponent implements OnInit {
  displayedColumns = ['id', 'name', 'tag', 'order', 'created', 'updated', 'control'];

  @ViewChild('filter') filter: ElementRef;

  report$: BqsReportListDataSource | null;
  @select(createModelLoadingSelector('report')) loading: Observable<boolean>;

  constructor(public modelActions: ModelActions,
              public store: NgRedux<IAppState>) {
    this.store.dispatch(this.modelActions.listModel('report'));
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

  }

  del(urlsafe: string) {
    this.store.dispatch(this.modelActions.deleteModel('report', urlsafe));
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

  @select(['admin', 'report', 'items']) report$: Observable<IModel[]>;

  constructor() {
    super();
  }

  connect(): Observable<IModel[]> {
    const displayDataChanges = [
      this.report$,
      this._filterChange,
    ];

    return Observable.merge(...displayDataChanges).mergeMap(
      () => this.report$.map(
        report => {
          if (!report) return;
          return report.filter(item => {
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
