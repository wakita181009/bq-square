import {NgModule, ModuleWithProviders} from '@angular/core';
import {HttpModule} from '@angular/http';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  MatInputModule,
  MatSlideToggleModule,
  MatButtonModule,
  MatChipsModule,
  MatOptionModule,
  MatMenuModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatSidenavModule,
  MatIconModule,
  MatTableModule
} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';
import {TagInputModule} from 'ngx-chips';
import {ExpansionPanelsModule } from 'ng2-expansion-panels';
import {RouterModule} from '@angular/router';

import {NgReduxFormModule} from '@angular-redux/form';

import {NavBar} from './components/navbar';
import {SERVICES} from './services';

import {MultiInput} from './components/multi-input';


const mat_MODULES = [
  MatInputModule,
  MatSlideToggleModule,
  MatButtonModule,
  MatChipsModule,
  MatOptionModule,
  MatMenuModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatSidenavModule,
  MatIconModule,
  MatTableModule,
  CdkTableModule,
  TagInputModule,
  ExpansionPanelsModule
];

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ...mat_MODULES,
    RouterModule,
    NgReduxFormModule,
  ],
  declarations: [NavBar, MultiInput],
  exports: [
    NavBar,
    MultiInput,
    HttpModule,
    FormsModule,
    ...mat_MODULES,
    NgReduxFormModule,
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        ...SERVICES,
      ]
    }
  }
}
