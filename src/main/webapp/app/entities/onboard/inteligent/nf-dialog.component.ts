import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { NotafiscalService } from '../../../services/notafiscal.service';
import { IInteligent } from '../../../model/inteligent.model';
import { TipoValor } from '../../../shared/constants/TipoValor.constants';
import { TipoComprovante } from '../../../shared/constants/TipoComprovante.constants';
import { INotafiscal } from '../../../model/notafiscal.model';

@Component({
  templateUrl: './nf-dialog.component.html',
})
export class NfDialogComponent implements OnInit {
  notafiscals: {
    notafiscal: INotafiscal;
    selected: boolean;
    enabled: boolean;
    parcela: boolean = false;
  }[] = [];
  notafiscalSelecteds: any = [];
  inteligent: IInteligent = {};
  taxa: number = 0;
  proximo: boolean = false;
  showNext: boolean = false;
  showTaxa: boolean = false;

  constructor(public activeModal: NgbActiveModal, protected eventManager: JhiEventManager, private notaFiscalService: NotafiscalService) {}

  ngOnInit(): void {
    this.loadNotas(this.inteligent);
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  public loadNotas(inteligent: IInteligent): void {
    if (
      inteligent.tipoValor === TipoValor[TipoValor.PRINCIPAL] &&
      inteligent?.comprovante &&
      inteligent.comprovante?.tipoComprovante === TipoComprovante[TipoComprovante.TITULO]
    ) {
      const queryParam = {
        'processado.equals': false,
        'notCnpj.contains': `${inteligent?.cnpj}`.substring(0, 8),
        'notDataparcela.lessThanOrEqual': inteligent?.datalancamento ? inteligent?.datalancamento.format('YYYY-MM-DD') : '',
        sort: ['notDataparcela,desc'],
      };
      this.notaFiscalService.query(queryParam).subscribe(response => {
        const nfs = response.body || [];
        for (const item in nfs) {
          const _nf = { notafiscal: nfs[item], selected: false, enabled: true, parcela: false };
          this.notafiscals.push(_nf);
        }
      });
    }
  }

  public check(nf: any): void {
    this.showNext = true;
    if (this.notafiscals.filter(n => n.selected).length === 0) {
      this.notafiscals.forEach(n => (n.enabled = true));
      this.showNext = false;
      return;
    }
    let total = this.getTotal();
    const nfs = this.notafiscals.filter(value => !value.selected);
    for (const item in nfs) {
      const value = total + nfs[item].notafiscal.notValorparcela + this.inteligent.debito;
      if (value > 0) {
        nfs[item].enabled = false;
      } else {
        nfs[item].enabled = true;
      }
    }
  }

  public next(): void {
    this.generateTaxa();
    this.generateParcela();
    this.showNext = false;
    this.proximo = true;
  }

  private generateParcela(): void {
    this.notafiscalSelecteds = JSON.parse(JSON.stringify(this.notafiscals.filter(n => n.selected)));
    if (this.notafiscalSelecteds.length === 1 && this.getTotal() > this.inteligent.debito * -1) {
      let newNF = JSON.parse(JSON.stringify(this.notafiscalSelecteds[0]));
      newNF.notafiscal.id = null;
      newNF.notafiscal.notParcela = '00' + (+newNF.notafiscal.notParcela + 1);
      newNF.notafiscal.processado = false;
      newNF.notafiscal.notValorparcela = this.notafiscalSelecteds[0].notafiscal.notValorparcela + this.inteligent.debito;
      this.notafiscalSelecteds.push(newNF);
      this.notafiscalSelecteds[0].notafiscal.notValorparcela = this.inteligent.debito * -1;
      this.showTaxa = true;
    }
  }

  private generateTaxa(): void {
    const value = (this.inteligent.debito + this.getTotal()) * -1;
    if (value > 0) {
      this.taxa = value;
    }
  }

  public back(): void {
    this.proximo = false;
    this.showNext = true;
    this.showTaxa = false;
    this.notafiscalSelecteds = [];
    this.taxa = 0;
  }

  private getTotal(): number {
    let valueBegin = 0;
    return this.notafiscals.filter(value => value.selected).reduce((accum, value) => accum + value.notafiscal.notValorparcela, valueBegin);
  }

  public atualizarTaxa(inputTaxa: any): void {
    const newTaxa = +inputTaxa.value.trim().replace(/[,]/g, '.').replace(/[R$]/g, '');
    this.notafiscalSelecteds[0].notafiscal.notValorparcela = this.notafiscalSelecteds[0].notafiscal.notValorparcela + this.taxa - newTaxa;
    this.taxa = newTaxa;
  }
}
