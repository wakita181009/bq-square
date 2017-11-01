import {Component, OnDestroy} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs';

import {Router, ActivatedRoute, Params} from '@angular/router';

import {IAppState} from 'app/types';
import {ModelActions} from 'app/store/model/model.actions';


@Component({
  selector: 'bqs-bqs-global-key-edit',
  templateUrl: './bqs-global-key-edit.component.html',
  styleUrls: ['./bqs-global-key-edit.component.scss'],
})
export class BqsGlobalKeyEditComponent implements OnDestroy {

  editMode: string;
  urlsafe: string;

  @select(['admin', 'global_key', 'loading']) loading: Observable<boolean>;

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
          this.store.dispatch(this.modelActions.readModel('global_key', urlsafe));
          this.editMode = "Update";
          this.urlsafe = urlsafe;
        }
      });

    this.store.dispatch(this.modelActions.listModel('user'));
  }

  ngOnDestroy() {
    this.store.dispatch(this.modelActions.newForm('global_key'));
  }

  onSumbit() {
    switch (this.editMode) {
      case 'Create':
        this.store.dispatch(this.modelActions.createModel('global_key'));
        this.router.navigate(['admin', 'global_key_value']);
        break;
      case 'Update':
        this.store.dispatch(this.modelActions.updateModel('global_key', this.urlsafe));
    }
  }

}
