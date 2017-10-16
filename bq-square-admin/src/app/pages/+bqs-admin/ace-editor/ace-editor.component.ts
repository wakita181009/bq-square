import {Component, OnInit, forwardRef, Input, ViewChild} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

import 'brace/mode/sql';
import 'brace/mode/json';
import 'brace/ext/language_tools';
import 'brace/theme/chrome';


const noop = () => {
};

const MULTI_INPUT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AceEditorComponent),
  multi: true
};

@Component({
  selector: 'bqs-ace-editor',
  templateUrl: 'ace-editor.component.html',
  styleUrls: ['ace-editor.component.scss'],
  providers: [MULTI_INPUT_VALUE_ACCESSOR],
})
export class AceEditorComponent implements OnInit, ControlValueAccessor {

  @Input() mode: string;

  _text: string = "";
  options: any = {
    behavioursEnabled: true,
    enableSnippets: false,
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    autoScrollEditorIntoView: true,
  };

  schema: any = "=";

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  get value(): string {
    return this._text
  }

  set value(v: string) {
    this._text = v;
    this.onChangeCallback(v);
  }

  //Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value!== this._text) {
      this._text = value
    }
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  onChange(code) {
    this._text = code;
    this.onChangeCallback(code)
  }



  schemaCompleter = {
    getCompletions(state, session, pos, prefix, callback) {
      if (prefix.length === 0 || !this.schema) {
        callback(null, []);
        return;
      }

      if (!this.schema.keywords) {
        const keywords = {};

        this.schema.forEach((table) => {
          keywords[table.name] = 'Table';

          table.columns.forEach((c) => {
            keywords[c] = 'Column';
            keywords[`${table.name}.${c}`] = 'Column';
          });
        });

        // this.schema.keywords = map(keywords, (v, k) =>
        //     ({
        //         name: k,
        //         value: k,
        //         score: 0,
        //         meta: v,
        //     })
        // );
      }
      callback(null, this.schema.keywords);
    }
  };

  constructor() { }

  ngOnInit() {
    window['ace'].acequire(['ace/ext/language_tools'], (langTools) => {
      langTools.addCompleter(this.schemaCompleter);
    });
  }

}
