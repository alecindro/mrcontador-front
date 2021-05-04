import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { IInteligent } from '../../../model/inteligent.model';
import { InteligentService } from '../../../services/inteligent.service';
import { ParceiroService } from '../../../services/parceiro.service';
import { IParceiro } from '../../../model/parceiro.model';
import { IAgenciabancaria } from '../../../model/agenciabancaria.model';
import { HttpResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { IRegra, Regra } from '../../../model/regra.model';
import { SERVER_API_URL } from '../../../app.constants';
import { UploadService } from '../../../services/file-upload.service';
import { IComprovante } from '../../../model/comprovante.model';
import { INotafiscal } from '../../../model/notafiscal.model';
import { ContaService } from '../../../services/conta.service';
import { IConta } from '../../../model/conta.model';
import { TipoRegra } from '../../../shared/constants/TipoRegra.constants';
import { NgbPopover, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegraService } from '../../../services/regra.service';
import { AuthServerProvider } from '../../../core/auth/auth-jwt.service';
import { TipoAgencia } from '../../../shared/constants/TipoAgencia';
import { NotafiscalService } from '../../../services/notafiscal.service';
import { TipoComprovante } from '../../../shared/constants/TipoComprovante.constants';
import { TipoValor } from '../../../shared/constants/TipoValor.constants';
import { NfDialogComponent } from './nf-dialog.component';
import { NfDeleteComponent } from './nf-delete.component';
import { AgenciabancariaService } from '../../../services/agenciabancaria.service';

@Component({
  selector: 'jhi-inteligent',
  templateUrl: './inteligent.component.html',
  styleUrls: ['./inteligent.component.scss'],
})
export class InteligentComponent implements OnInit, OnDestroy {
  parceiroListener!: Subscription;
  nfListener!: Subscription;
  divergencias: IInteligent[] = [];
  conciliados: IInteligent[] = [];
  regra: IRegra = {};
  readonly regras = TipoRegra;
  readonly tipoComprovante = TipoComprovante;
  readonly tipoValor = TipoValor;

  parceiro?: IParceiro;
  agenciaSelected?: IAgenciabancaria;
  resourceUrl = SERVER_API_URL + 'api/downloadFile/comprovante/';
  resourceUrlNfe = SERVER_API_URL + 'api/downloadFile/notafiscal/';
  resourceUrlLancamento = SERVER_API_URL + 'api/downloadFile/lancamento/';
  tipoRegras: { tipoRegra?: string; regDescricao?: string }[] = [];
  tipoRegraSelected: { tipoRegra?: string; regDescricao?: string } = {};
  contaSelected?: IConta;
  inteligentSelected: IInteligent = {};
  popover?: NgbPopover;
  popoverConta?: NgbPopover;
  popoverTaxa?: NgbPopover;
  popoverNotaFiscal?: NgbPopover;
  activeTab = 1;
  notafiscals: INotafiscal[] = [];
  histFinalElement?: any;
  histFinal?: string;
  periodo = '';

  constructor(
    private eventManager: JhiEventManager,
    protected inteligentService: InteligentService,
    protected parceiroService: ParceiroService,
    protected notafiscalService: NotafiscalService,
    protected agenciabancariaService: AgenciabancariaService,
    public spinner: NgxSpinnerService,
    public activatedRoute: ActivatedRoute,
    public fileService: UploadService,
    public contaService: ContaService,
    public regraService: RegraService,
    public authServerProvider: AuthServerProvider,
    protected modalService: NgbModal
  ) {
    this.registerParceiroListener();
    this.registerNFListener();
  }

  ngOnInit(): void {
    this.parceiro = this.parceiroService.getParceiroSelected();
    this.loadAgencias();
  }

  private loadAgencias() {
    if (this.parceiro) {
      const queryParam = {
        'parceiroId.equals': this.parceiro?.id,
        'ageSituacao.equals': 1,
      };
      this.agenciabancariaService.query(queryParam).subscribe((res: HttpResponse<IAgenciabancaria[]>) => {
        const _agencias = res.body || [];
        const agencias = _agencias?.filter(agencia => {
          return agencia.ageSituacao === true && agencia.tipoAgencia === TipoAgencia[TipoAgencia.CONTA];
        });
        this.parceiro?.agenciabancarias = agencias;
        this.agenciaSelected = agencias.filter(agencia => {
          return agencia.id === this.agenciabancariaService.getAgenciaSelected();
        })[0];
        if (agencias && agencias.length > 0 && !this.agenciaSelected) {
          this.agenciaSelected = agencias[0];
          this.agenciabancariaService.setAgenciaSelected(this.agenciaSelected);
        }
        this.loadPeriodo();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.parceiroListener) {
      this.eventManager.destroy(this.parceiroListener);
    }
    if (this.nfListener) {
      this.eventManager.destroy(this.nfListener);
    }
  }

  private loadPeriodo(): void {
    const _date = new Date();
    this.periodo = _date.getMonth() + '' + _date.getFullYear();
    this.loadData();
  }

  private loadData(): void {
    const queryParam = {
      'parceiroId.equals': this.parceiro?.id,
      'agenciabancariaId.equals': this.agenciaSelected?.id,
      'periodo.equals': this.periodo,
      sort: ['datalancamento,asc', 'comprovante,asc'],
    };
    this.spinner.show();
    this.inteligentService.query(queryParam).subscribe(
      (res: HttpResponse<IInteligent[]>) => {
        const inteligents = res.body || [];
        this.conciliados = inteligents.filter(function (item) {
          return item.associado === true;
        });
        this.divergencias = inteligents.filter(function (item) {
          return item.associado === false;
        });
        this.spinner.hide();
      },
      (err: any) => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  saveRegra(): void {
    this.regra.tipoRegra = this.tipoRegraSelected.tipoRegra;
    this.regra.regDescricao = this.tipoRegraSelected.regDescricao;
    this.regra.parceiro = this.parceiro;
    this.regra.conta = this.contaSelected;
    if (!this.regra.regHistorico) {
      this.regra.regHistorico = this.regra.regDescricao;
    }
    this.regraService.create(this.regra).subscribe(response => {
      console.log(response);
      this.cancelRegra();
      this.loadData();
    });
  }
  cancelRegra(): void {
    this.contaSelected = undefined;
    this.tipoRegraSelected = {};
    this.regra = {};
    if (this.popover) {
      this.popover.close();
    }
  }

  onChangeAgencia(): void {
    this.loadPeriodo();
    this.activeTab = 1;
    if (this.agenciaSelected && this.agenciaSelected?.tipoAgencia === TipoAgencia[TipoAgencia.CAIXA]) {
      this.activeTab = 4;
    }
    if (this.agenciaSelected && this.agenciaSelected?.tipoAgencia === TipoAgencia[TipoAgencia.APLICACAO]) {
      this.activeTab = 3;
    }
    this.agenciabancariaService.setAgenciaSelected(this.agenciaSelected);
  }

  private registerNFListener(): void {
    this.nfListener = this.eventManager.subscribe('nfassociate', (response: any) => {
      this.loadData();
    });
  }

  private registerParceiroListener(): void {
    this.parceiroListener = this.eventManager.subscribe('parceiroSelected', () => {
      this.parceiro = this.parceiroService.getParceiroSelected();
      this.loadAgencias();
    });
  }

  selectConta(inteligent: IInteligent, popover: NgbPopover): void {
    this.inteligentSelected = inteligent;
    if (this.popoverConta?.isOpen()) {
      this.popoverConta.close();
    }
    popover.open({ popover });
    this.popoverConta = popover;
  }

  selectTaxa(inteligent: IInteligent, popover: NgbPopover): void {
    this.inteligentSelected = inteligent;
    if (this.popoverTaxa?.isOpen()) {
      this.popoverTaxa.close();
    }
    popover.open({ popover });
    this.popoverTaxa = popover;
  }

  closeTaxa(): void {
    this.inteligentSelected = {};
    if (this.popoverTaxa) {
      this.popoverTaxa.close();
    }
  }

  closeNota(): void {
    this.notafiscals = [];
    if (this.popoverNotaFiscal) {
      this.popoverNotaFiscal.close();
    }
  }

  saveConta(): void {
    if (this.inteligentSelected) {
      this.inteligentSelected.associado = true;
      this.inteligentSelected.parceiro = this.parceiro;
      this.inteligentSelected.agenciabancaria = this.agenciaSelected;
      this.inteligentSelected.conta = this.contaSelected;
      this.inteligentService.update(this.inteligentSelected).subscribe(() => {
        this.cancelConta();
        this.loadData();
      });
    }
  }
  cancelConta(): void {
    this.contaSelected = undefined;
    this.inteligentSelected = {};
    if (this.popoverConta) {
      this.popoverConta.close();
    }
  }

  selectHistFinal(inteligent: IInteligent, event: any): void {
    if (this.histFinalElement) {
      this.cancelHistFinal();
    }
    this.histFinal = inteligent.historicofinal;
    this.histFinalElement = event.currentTarget;
    this.histFinalElement.parentElement.nextElementSibling.removeAttribute('class');
    this.histFinalElement.parentElement.setAttribute('class', 'no_show');
  }
  cancelHistFinal(): void {
    this.histFinal = '';
    this.histFinalElement.parentElement.removeAttribute('class');
    this.histFinalElement.parentElement.nextElementSibling.setAttribute('class', 'no_show');
  }
  saveHistFinal(inteligent: IInteligent): void {
    const histFinalCopy = this.histFinal;
    inteligent.historicofinal = this.histFinal;
    this.spinner.show();
    this.inteligentService.update(inteligent).subscribe(
      resp => {
        inteligent = resp.body || {};
        this.histFinalElement.parentElement.removeAttribute('class');
        this.histFinalElement.parentElement.nextElementSibling.setAttribute('class', 'no_show');
        this.spinner.hide();
      },
      err => {
        console.log(err);
        this.spinner.hide();
        inteligent.historicofinal = histFinalCopy;
        this.histFinalElement.parentElement.removeAttribute('class');
        this.histFinalElement.parentElement.nextElementSibling.setAttribute('class', 'no_show');
      }
    );
  }

  selectInteligent(inteligent: IInteligent, popover: NgbPopover): void {
    this.regra = new Regra();
    this.regra.regHistorico = '';
    this.tipoRegras = [];
    const tipoRegraDefault = { tipoRegra: 'Selecione ..', regDescricao: undefined };
    this.tipoRegras.push(tipoRegraDefault);
    this.tipoRegraSelected = tipoRegraDefault;
    if (inteligent.extrato?.infoAdicional) {
      this.tipoRegras.push({ tipoRegra: TipoRegra[TipoRegra.INFORMACAO_ADICIONAL], regDescricao: inteligent.extrato?.infoAdicional });
    }
    if (inteligent.beneficiario) {
      this.tipoRegras.push({ tipoRegra: TipoRegra[TipoRegra.BENEFICIARIO], regDescricao: inteligent.beneficiario });
    }
    if (inteligent.comprovante?.tipoComprovante !== 'TITULO') {
      this.tipoRegras.push({ tipoRegra: TipoRegra[TipoRegra.HISTORICO], regDescricao: inteligent?.historico });
    }
    if (this.popover?.isOpen()) {
      this.popover.close();
    }
    popover.open({ popover });
    this.popover = popover;
  }
  public downloadComprovante(comprovante: IComprovante): void {
    this.fileService.downloadFile(this.resourceUrl + comprovante.id).subscribe(
      response => {
        const blob: any = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      },
      error => console.log('Error downloading the file', error),
      () => console.info('File downloaded successfully')
    );
  }

  loadNotas(inteligent: IInteligent): void {
    const modalRef = this.modalService.open(NfDialogComponent, { size: 'lg', backdrop: 'static', scrollable: true });
    modalRef.componentInstance.inteligent = inteligent;
  }

  selectNota(popover: NgbPopover): void {
    if (this.popoverNotaFiscal?.isOpen()) {
      this.popoverNotaFiscal.close();
    }
    popover.open({ popover });
    this.popoverNotaFiscal = popover;
  }

  public downloadNfe(nfe: INotafiscal): void {
    this.fileService.downloadFile(this.resourceUrlNfe + nfe.id).subscribe(
      response => {
        const blob: any = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      },
      error => console.log('Error downloading the file', error),
      () => console.info('File downloaded successfully')
    );
  }
  selectedConta(conta: IConta): void {
    this.contaSelected = conta;
  }

  public downloadLancamento(): void {
    const sistema = this.authServerProvider.getSistema();
    if (this.parceiro?.codExt) {
      const _url =
        this.resourceUrlLancamento + this.periodo + '/' + this.agenciaSelected?.id + '/' + this.parceiro?.id + '/' + this.parceiro?.codExt;
      this.fileService.downloadFile(_url).subscribe(
        response => {
          const blob: any = new Blob([response], { type: 'application/octet-stream' });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        },
        error => console.log('Error downloading the file', error),
        () => console.info('File downloaded successfully')
      );
    } else {
      alert('Cadastrar código do sistema do parceiro.');
    }
  }
  public removeNf(inteligent: IInteligent): void {
    const modalRef = this.modalService.open(NfDeleteComponent, { size: 'lg', backdrop: 'static', scrollable: true });
    modalRef.componentInstance.inteligent = inteligent;
  }

  public selectPeriodo(value: string): void {
    this.periodo = value;
    this.loadData();
  }
}
