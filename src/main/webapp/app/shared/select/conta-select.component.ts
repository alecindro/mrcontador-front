import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError } from 'rxjs/operators';
import { IConta } from 'app/model/conta.model';
import { ContaService } from 'app/services/conta.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'jhi-conta-select',
  templateUrl: './conta-select.component.html',
  providers: [ContaService],
})
export class ContaSelectComponent {
  @Input()
  parceiro?: number;
  @Output() contaSelected = new EventEmitter();
  @Input()
  conta?: IConta;
  @Input()
  disabled = false;

  constructor(public contaService: ContaService, public spinner: NgxSpinnerService) {}

  selectedConta(event: any): void {
    this.conta = event.item;
    this.contaSelected.emit(event.item);
  }

  search = (text$: Observable<any>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.spinner.show()),
      switchMap(term => {
        if (term && this.parceiro) {
          const param = { 'parceiroId.equals': this.parceiro, sort: ['conConta,asc'], page: 0, size: 10 };
          if (!isNaN(term)) {
            param['conConta.greaterThanOrEqual'] = term;
          } else {
            param['conDescricao.contains'] = term;
          }
          return this.contaService
            .query(param)
            .pipe(map(response => response.body || of([])))
            .pipe(
              tap(() => this.spinner.hide()),
              catchError(() => {
                this.spinner.hide();
                return of([]);
              })
            );
        }
        this.spinner.hide();
        return of('');
      }),
      tap(() => this.spinner.hide())
    );

  contaFormatter = (conta: IConta) => conta?.conConta + ' -  ' + conta?.conClassificacao + ' -  ' + conta?.conDescricao || '';

  inputcontaFormatter = (conta: IConta) => conta?.conConta + ' -  ' + conta?.conDescricao || '';
}
