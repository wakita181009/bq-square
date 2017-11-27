import {NgModule, ModuleWithProviders} from '@angular/core';
import {HttpModule} from '@angular/http';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatInputModule,
  MatAutocompleteModule,
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
  MatPaginatorModule,
  MatSortModule
} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';
import {TagInputModule} from 'ngx-chips';
import {ExpansionPanelsModule} from 'ng2-expansion-panels';
import {RouterModule} from '@angular/router';

import {NgReduxFormModule} from '@angular-redux/form';

import {NavBar} from './components/navbar';
import {SERVICES} from './services';

import {MultiInput} from './components/multi-input';


const MAT_MODULES = [
  MatInputModule,
  MatAutocompleteModule,
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
  MatPaginatorModule,
  MatSortModule,
  TagInputModule,
  ExpansionPanelsModule
];

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    ...MAT_MODULES,
    RouterModule,
    NgReduxFormModule,
  ],
  declarations: [NavBar, MultiInput],
  exports: [
    NavBar,
    MultiInput,
    HttpModule,
    // HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ...MAT_MODULES,
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
