import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'jhi-periodo',
  templateUrl: './periodo.component.html',
})
export class PeriodoComponent implements OnChanges {
  @Input()
  periodo = '';
  @Input()
  clazz = '';
  @Input()
  name = '';

  dataSelected?: any;
  @Output() periodoSelected = new EventEmitter();

  constructor() {}

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    this.changePeriodo(changes.periodo.currentValue);
  }

  public onChangeData(): void {
    const _data = this.dataSelected.split('-');
    const year = _data[0];
    let month = _data[1];
    if (month[0] === '0') {
      month = month[1];
    }
    this.periodo = month + '' + year;
    this.periodoSelected.emit(this.periodo);
  }

  private changePeriodo(value: string) {
    this.periodo = value;
    if (value) {
      const year = value.substr(-4);
      let month = value.slice(-6, -4);
      if (month.length === 1) {
        month = '0' + month;
      }
      this.dataSelected = year + '-' + month;
    }
  }
}
