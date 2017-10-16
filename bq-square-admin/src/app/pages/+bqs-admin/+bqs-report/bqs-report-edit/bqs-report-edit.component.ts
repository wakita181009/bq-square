import {Component, OnDestroy} from '@angular/core';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs';

import {Router, ActivatedRoute, Params} from '@angular/router';

import {IAppState} from 'app/types';
import {ModelActions} from 'app/store/model/model.actions';

@Component({
  selector: 'bqs-bqs-report-edit',
  templateUrl: './bqs-report-edit.component.html',
  styleUrls: ['./bqs-report-edit.component.scss']
})
export class BqsReportEditComponent implements OnDestroy {

  editMode: string;
  urlsafe: string;

  @select(['admin', 'report', 'loading']) loading: Observable<boolean>;

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
          this.store.dispatch(this.modelActions.readModel('report', urlsafe));
          this.editMode = "Update";
          this.urlsafe = urlsafe;
        }
      });

  }

  ngOnDestroy() {
    this.store.dispatch(this.modelActions.newForm('report'));
  }


  onSumbit() {
    switch (this.editMode) {
      case 'Create':
        this.store.dispatch(this.modelActions.createModel('report'));
        this.router.navigate(['admin', 'report']);
        break;
      case 'Update':
        this.store.dispatch(this.modelActions.updateModel('report', this.urlsafe));
    }
  }

}
