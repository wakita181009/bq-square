import {Component, ChangeDetectionStrategy} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs';

@Component({
  selector: 'bqs-bqs-login',
  templateUrl: './bqs-login.component.html',
  styleUrls: ['./bqs-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BqsLoginComponent {

  @select(['auth', 'error']) auth_error$: Observable<any>;

  constructor(public snackBar: MatSnackBar) {
    this.auth_error$.subscribe(
      err => {
        if (err) setTimeout(() => this.openSnackBar(err))
      }
    )
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'close', {
      duration: 3000,
    });
  }


}
