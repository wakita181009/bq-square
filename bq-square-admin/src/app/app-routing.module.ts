import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from './auth/auth.guard';

import {BqsLoginComponent} from './pages/bqs-login/bqs-login.component';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: 'app/pages/+bqs-square/bqs-square.module#BqsSquareModule',
      }
    ]
  },
  {
    path: 'square',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: 'app/pages/+bqs-square/bqs-square.module#BqsSquareModule',
      },
      {
        path: ':urlsafe',
        loadChildren: 'app/pages/+bqs-square/bqs-square.module#BqsSquareModule',
      },
    ]
  },
  {
    path: 'admin',
    loadChildren: 'app/pages/+bqs-admin/bqs-admin.module#BqsAdminModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'setup',
    loadChildren: 'app/pages/+bqs-setup/bqs-setup.module#BqsSetupModule',
  },
  {
    path: 'login',
    component: BqsLoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
