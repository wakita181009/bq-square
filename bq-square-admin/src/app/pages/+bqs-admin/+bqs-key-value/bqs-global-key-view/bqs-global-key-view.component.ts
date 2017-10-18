import {Component, OnDestroy} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs';

import {Router, ActivatedRoute, Params} from '@angular/router';

import {IAppState, IModel} from 'app/types';
import {ModelActions} from 'app/store/model/model.actions';
import {createModelLoadingSelector, userEmailsSelector} from 'app/selectors/model';

@Component({
  selector: 'bqs-bqs-global-key-view',
  templateUrl: './bqs-global-key-view.component.html',
  styleUrls: ['./bqs-global-key-view.component.scss'],
})
export class BqsGlobalKeyViewComponent implements OnDestroy {
  @select(['admin', 'global_key', 'form']) global_key$: Observable<any>;

  @select(['admin', 'global_value', 'items']) global_value_items: Observable<IModel[]>;
  @select(createModelLoadingSelector('global_value')) global_value_loading: Observable<boolean>;

  @select(userEmailsSelector) user_emails: Observable<string[]>;

  editMode: string = "None";
  isPredefined: boolean = false;

  _global_id: string;

  constructor(private modelActions: ModelActions,
              private store: NgRedux<IAppState>,
              private route: ActivatedRoute,
              private router: Router) {
    this.route.params
      .map((params: Params) => params['urlsafe'])
      .subscribe((urlsafe) => {
        this.store.dispatch(this.modelActions.readModel('global_key', urlsafe));
      });

    this.global_key$.subscribe((k) => {
      this.isPredefined = k.type === 'PREDEFINED';
      if (this.isPredefined) {
        let id = k.id;
        if (id) {
          this.store.dispatch(
            this.modelActions.listModel('global_value',
              {q: `ANCESTOR%20is%20Key%28%27GlobalKeyModel%27%2C%20%27${id}%27%29`}
            ));
          this._global_id = id;
        }
        this.store.dispatch(this.modelActions.listModel('user'));
      }
    });

  }

  ngOnDestroy() {
    this.store.dispatch(this.modelActions.removeItems('global_value'));
    this.store.dispatch(this.modelActions.newForm('global_key'));
    this.store.dispatch(this.modelActions.newForm('global_value'));
  }

  addGlobalValue() {
    this.store.dispatch({
      type: '@@angular-redux/form/FORM_CHANGED',
      payload: {
        path: [
          'admin',
          'global_value',
          'form'
        ],
        value: {global_key: this._global_id}
      }
    });
    this.editMode = 'Create';
  }

  editGlobalValue(urlsafe: string) {
    this.store.dispatch(this.modelActions.readModel('global_value', urlsafe));
    this.editMode = "Update";
  }

  createGlobalValue() {
    this.store.dispatch(this.modelActions.createModel('global_value'));
    this.editMode = "None";
    this.store.dispatch(this.modelActions.newForm('global_value'));
  }

  updateGlobalValue(urlsafe: string) {
    this.store.dispatch(this.modelActions.updateModel('global_value', urlsafe));
    this.editMode = "None";
    this.store.dispatch(this.modelActions.newForm('global_value'));
  }

  deleteGlobalValue(urlsafe: string) {
    this.store.dispatch(this.modelActions.deleteModel('global_value', urlsafe));
  }


}
