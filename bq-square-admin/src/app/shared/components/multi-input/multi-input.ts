import {Component, Input, forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';


const noop = () => {
};

const MULTI_INPUT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MultiInput),
  multi: true
};

@Component({
  selector: 'multi-input',
  templateUrl: 'multi-input.html',
  styleUrls: ['multi-input.scss'],
  providers: [MULTI_INPUT_VALUE_ACCESSOR]
})
export class MultiInput implements ControlValueAccessor{

  @Input() placeholder;

  _values: string[] = [];

  addValue(value) {
    if (value && this._values.indexOf(value) === -1) {
      this._values.push(value);
      this.onChangeCallback(this._values)
    }
  }

  removeValue(i) {
    this._values.splice(i, 1);
    this.onChangeCallback(this._values)
  }

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;


  get value(): string[] {
    return this._values
  }

  set value(v: string[]) {
    this._values = v;
    this.onChangeCallback(v);
  }

  //Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value && value.toString() !== this._values.toString()) {
      this._values = value
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

}


