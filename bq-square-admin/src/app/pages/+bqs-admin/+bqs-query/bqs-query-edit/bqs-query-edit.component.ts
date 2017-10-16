import {Component, OnDestroy} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs';

import {Router, ActivatedRoute, Params} from '@angular/router';

import {IAppState} from 'app/types';
import {ModelActions} from 'app/store/model/model.actions';


@Component({
  selector: 'bqs-query-edit',
  templateUrl: './bqs-query-edit.component.html',
  styleUrls: ['./bqs-query-edit.component.scss']
})
export class BqsQueryEditComponent implements OnDestroy {

  editMode: string;
  urlsafe: string;

  @select(['admin', 'query', 'loading']) loading: Observable<boolean>;

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
          this.store.dispatch(this.modelActions.readModel('query', urlsafe));
          this.editMode = "Update";
          this.urlsafe = urlsafe;
        }
      });

  }


  ngOnDestroy() {
    this.store.dispatch(this.modelActions.newForm('query'));
  }


  onSumbit() {
    switch (this.editMode) {
      case 'Create':
        this.store.dispatch(this.modelActions.createModel('query'));
        this.router.navigate(['admin', 'query']);
        break;
      case 'Update':
        this.store.dispatch(this.modelActions.updateModel('query', this.urlsafe));
    }
  }

}
