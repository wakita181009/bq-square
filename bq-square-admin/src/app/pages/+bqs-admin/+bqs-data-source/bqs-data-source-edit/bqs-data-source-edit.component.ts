import {Component, OnDestroy} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs';

import {Router, ActivatedRoute, Params} from '@angular/router';

import {IAppState, IModel} from 'app/types';
import {ModelActions} from 'app/store/model/model.actions';


@Component({
  selector: 'bqs-data-source-edit',
  templateUrl: './bqs-data-source-edit.component.html',
  styleUrls: ['./bqs-data-source-edit.component.scss']
})
export class BqsDataSourceEditComponent implements OnDestroy {

  editMode: string;
  urlsafe: string;

  @select(['admin', 'data_source', 'loading']) loading: Observable<boolean>;
  @select(['admin', 'data_source', 'form']) data_source$: Observable<IModel>;

  data_source_stream;

  constructor(private modelActions: ModelActions,
              private store: NgRedux<IAppState>,
              private route: ActivatedRoute,
              private router: Router) {
    this.route.params
      .map((params: Params) => params['urlsafe'])
      .subscribe((urlsafe) => {
        if (!urlsafe) {
          this.editMode = "Create";
        } else {
          this.store.dispatch(this.modelActions.readModel('data_source', urlsafe));
          this.editMode = "Update";
          this.urlsafe = urlsafe;
        }
      });

    this.data_source_stream = this.data_source$.subscribe(ds => {
      if (ds && ds.type === 'bigquery'
        && (ds.cloudsql_connection_name || ds.cloudsql_user || ds.cloudsql_password || ds.cloudsql_db)) {
        this.store.dispatch({
          type: '@@angular-redux/form/FORM_CHANGED',
          payload: {
            path: [
              'admin',
              'data_source',
              'form'
            ],
            value: {
              cloudsql_connection_name: null,
              cloudsql_user: null,
              cloudsql_password: null,
              cloudsql_db: null
            }
          }
        });
      }
    })

  }


  ngOnDestroy() {
    this.data_source_stream.unsubscribe();
    this.store.dispatch(this.modelActions.newForm('data_source'));
  }


  onSumbit() {
    switch (this.editMode) {
      case 'Create':
        this.store.dispatch(this.modelActions.createModel('data_source'));
        this.router.navigate(['admin', 'data_source']);
        break;
      case 'Update':
        this.store.dispatch(this.modelActions.updateModel('data_source', this.urlsafe));
    }
  }

}
