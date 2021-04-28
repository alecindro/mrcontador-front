import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiEventWithContent } from 'ng-jhipster';
import { NotafiscalService } from '../../../services/notafiscal.service';
import { IInteligent } from '../../../model/inteligent.model';
import { TipoValor } from '../../../shared/constants/TipoValor.constants';
import { TipoComprovante } from '../../../shared/constants/TipoComprovante.constants';
import { INotafiscal } from '../../../model/notafiscal.model';
import { InteligentNfDTO } from '../../../model/inteligentNFDto';
import { InteligentService } from '../../../services/inteligent.service';

@Component({
  templateUrl: './nf-dialog.component.html',
})
export class NfDialogComponent implements OnInit {
  notafiscals: {
    notafiscal: INotafiscal;
    selected: boolean;
    enabled: boolean;
  }[] = [];
  notafiscalSelecteds: any = [];
  inteligent: IInteligent = {};
  taxa: number = 0;
  proximo: boolean = false;
  showNext: boolean = false;
  showTaxa: boolean = false;
  inteligentNfDTO: InteligentNfDTO = new InteligentNfDTO();

  constructor(
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager,
    private notaFiscalService: NotafiscalService,
    private inteligentService: InteligentService
  ) {}

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
      this.notaFiscalService.queryAll(queryParam).subscribe(response => {
        const nfs = response.body || [];
        for (const item in nfs) {
          const _nf = { notafiscal: nfs[item], selected: false, enabled: true };
          this.notafiscals.push(_nf);
        }
        this.inteligent = JSON.parse(JSON.stringify(this.inteligent));
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
      const value = total + (nfs[item].notafiscal.notValorparcela || 0) + (this.inteligent.debito || 0);
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
    if (this.notafiscalSelecteds.length === 1 && this.getTotal() > (this.inteligent.debito || 0) * -1) {
      let newNF = JSON.parse(JSON.stringify(this.notafiscalSelecteds[0]));
      newNF.notafiscal.id = null;
      newNF.notafiscal.notParcela = '00' + (+newNF.notafiscal.notParcela + 1);
      newNF.notafiscal.processado = false;
      newNF.notafiscal.notValorparcela = Number(
        this.notafiscalSelecteds[0].notafiscal.notValorparcela + (this.inteligent.debito || 0)
      ).toFixed(2);
      this.notafiscalSelecteds.push(newNF);
      this.notafiscalSelecteds[0].notafiscal.notValorparcela = (this.inteligent.debito || 0) * -1;
      this.showTaxa = true;
    }
  }

  private generateTaxa(): void {
    const value = ((this.inteligent.debito || 0) + this.getTotal()) * -1;
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
    this.inteligentNfDTO.inteligents = [];
    this.inteligentNfDTO.notafiscals = [];
  }

  private getTotal(): number {
    let valueBegin = 0;
    return this.notafiscals
      .filter(value => value.selected)
      .reduce((accum, value) => accum + (value.notafiscal.notValorparcela || 0), valueBegin);
  }

  public atualizarTaxa(inputTaxa: any): void {
    let newTaxa = +inputTaxa.value.trim().replace(/[,]/g, '.').replace(/[R$]/g, '');
    if (newTaxa > 0) {
      newTaxa = newTaxa - this.taxa;
    } else {
      newTaxa = this.taxa * -1;
      this.taxa = 0;
    }
    this.notafiscalSelecteds[0].notafiscal.notValorparcela = Number(
      (this.notafiscalSelecteds[0].notafiscal.notValorparcela || 0) - newTaxa
    ).toFixed(2);
    this.taxa = newTaxa;
  }

  public save(): void {
    this.updateInteligente();
    this.gerarTaxa();
    this.newInteligent();
    this.inteligentService.associateNf(this.inteligentNfDTO).subscribe(
      success => {
        this.eventManager.broadcast('nfassociate');
        this.activeModal.close();
      },
      err => {
        console.log(err);
      }
    );
  }

  private updateInteligente(): void {
    let inteligentCopy = JSON.parse(JSON.stringify(this.inteligent));
    this.notafiscalSelecteds[0].notafiscal.processado = true;
    inteligentCopy.notafiscal = this.notafiscalSelecteds[0].notafiscal;
    inteligentCopy.debito = +Number((this.notafiscalSelecteds[0].notafiscal.notValorparcela || 0) * -1).toFixed(2);
    inteligentCopy.historicofinal =
      'Pagto. NFe ' +
      this.notafiscalSelecteds[0].notafiscal.notNumero +
      '/' +
      this.notafiscalSelecteds[0].notafiscal.notParcela +
      ' de ' +
      this.notafiscalSelecteds[0].notafiscal.notEmpresa;
    inteligentCopy.associado = false;
    inteligentCopy.cnpj = this.notafiscalSelecteds[0].notafiscal?.notCnpj;
    inteligentCopy.tipoInteligent = 'x';
    if (this.taxa > 0) {
      inteligentCopy.tipoInteligent = 'C';
    }
    this.inteligentNfDTO.inteligents.push(inteligentCopy);
    this.inteligentNfDTO.notafiscals = this.notafiscalSelecteds.map((nfs: any) => {
      return nfs.notafiscal;
    });
  }

  private newInteligent(): void {
    const notas = this.notafiscalSelecteds
      .filter((nfs: any) => nfs.notafiscal.id !== null)
      .map((nfs: any) => {
        return nfs.notafiscal;
      });
    if (notas.length > 1) {
      for (let i = 1; i < notas.length; i++) {
        notas[i].notafiscal.processado = true;
        let newInteligent = JSON.parse(JSON.stringify(this.inteligent));
        newInteligent.id = null;
        newInteligent.debito = +Number((notas[i].notafiscal.notValorparcela || 0) * -1).toFixed(2);
        newInteligent.associado = false;
        newInteligent.cnpj = notas[i].notafiscal?.notCnpj;
        newInteligent.tipoInteligent = 'x';
        newInteligent.notafiscal = notas[i].notafiscal;
        newInteligent.historicofinal =
          'Pagto. NFe ' + notas[i].notafiscal.notNumero + '/' + notas[i].notafiscal.notParcela + ' de ' + notas[i].notafiscal.notEmpresa;
        this.inteligentNfDTO.inteligents.push(newInteligent);
      }
    }
  }

  private gerarTaxa(): void {
    if (this.taxa > 0) {
      const historicoFinal =
        'Pagto. de taxa bancária ref. ' +
        this.notafiscalSelecteds[0].notafiscal.notNumero +
        '/' +
        this.notafiscalSelecteds[0].notafiscal.notParcela +
        ' de ' +
        this.notafiscalSelecteds[0].notafiscal.notEmpresa;
      let inteligentTaxa = JSON.parse(JSON.stringify(this.inteligent));
      inteligentTaxa.id = null;
      inteligentTaxa.historico = 'Pagto. de Taxa bancária';
      inteligentTaxa.tipoValor = 'TAXA';
      inteligentTaxa.debito = +Number(this.taxa * -1).toFixed(2);
      inteligentTaxa.associado = false;
      inteligentTaxa.tipoInteligent = 'C';
      inteligentTaxa.cnpj = this.notafiscalSelecteds[0].notafiscal?.notCnpj;
      inteligentTaxa.historicofinal = historicoFinal;
      inteligentTaxa.notafiscal = this.notafiscalSelecteds[0].notafiscal;
      this.inteligentNfDTO.inteligents.push(inteligentTaxa);
    }
  }
}
