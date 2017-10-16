import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AceEditorModule} from "ng2-ace-editor";
// https://github.com/fxmontigny/ng2-ace-editor/issues/35
import {AceEditorComponent} from './ace-editor/ace-editor.component';

import 'brace';

@NgModule({
  imports: [
    CommonModule,
    AceEditorModule
  ],
  declarations: [AceEditorComponent],
  exports: [
    AceEditorModule,
    AceEditorComponent
  ]
})
export class BqsAdminSharedModule {
}
