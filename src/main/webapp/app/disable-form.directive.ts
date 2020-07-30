import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[jhiDisableForm]',
})
export class DisableFormDirective {
  constructor(private ngControl: NgControl) {}

  @Input() set disableControl(condition: boolean) {
    const action = condition ? 'disable' : 'enable';
    this.ngControl.control ? this.ngControl.control[action]() : null;
  }
}
