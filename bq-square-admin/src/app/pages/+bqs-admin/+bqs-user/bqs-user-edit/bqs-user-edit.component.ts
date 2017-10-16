import {Component, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs';

import {Router, ActivatedRoute, Params} from '@angular/router';

import {IAppState} from 'app/types';
import {ModelActions} from 'app/store/model/model.actions';

@Component({
  selector: 'bqs-user-edit',
  templateUrl: './bqs-user-edit.component.html',
  styleUrls: ['./bqs-user-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BqsUserEditComponent implements OnDestroy {

  editMode: string;
  urlsafe: string;

  @select(['admin', 'user', 'loading']) loading: Observable<boolean>;

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
          this.store.dispatch(this.modelActions.readModel('user', urlsafe));
          this.editMode = "Update";
          this.urlsafe = urlsafe;
        }
      });

  }


  ngOnDestroy() {
    this.store.dispatch(this.modelActions.newForm('user'));
  }


  onSumbit() {
    switch (this.editMode) {
      case 'Create':
        this.store.dispatch(this.modelActions.createModel('user'));
        this.router.navigate(['admin', 'user']);
        break;
      case 'Update':
        this.store.dispatch(this.modelActions.updateModel('user', this.urlsafe));
    }
  }

}
