import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiEventWithContent } from 'ng-jhipster';
import { MesAnoDTO } from '../../../shared/dto/mesAnoDTO';
import { IInteligent } from '../../../model/inteligent.model';
import { MESLABELS } from '../../../shared/constants/input.constants';
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
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { RegraService } from '../../../services/regra.service';
import { AuthServerProvider } from '../../../core/auth/auth-jwt.service';
import { TipoSistema } from '../../../shared/constants/TipoSistema';

type EntityArrayResponseType = HttpResponse<IConta[]>;

@Component({
  selector: 'jhi-inteligent',
  templateUrl: './inteligent.component.html',
  styleUrls: ['./inteligent.component.scss'],
})
export class InteligentComponent implements OnInit, OnDestroy {
  parceiroListener!: Subscription;
  divergencias?: IInteligent[] = [];
  conciliados?: IInteligent[] = [];
  regra: IRegra = {};
  mesAno!: MesAnoDTO;
  meses: number[] = [];
  readonly mesLabels = MESLABELS;
  anos: number[] = [];
  anoSelected?: number;
  mesSelected?: number;
  parceiro?: IParceiro;
  agenciaSelected?: IAgenciabancaria;
  resourceUrl = SERVER_API_URL + 'api/downloadFile/comprovante/';
  resourceUrlNfe = SERVER_API_URL + 'api/downloadFile/notafiscal/';
  resourceUrlLancamento = SERVER_API_URL + 'api/downloadFile/lancamento/';
  tipoRegras: { tipoRegra?: TipoRegra; regDescricao?: string }[] = [];
  tipoRegraSelected: { tipoRegra?: TipoRegra; regDescricao?: string } = {};
  contaSelected?: IConta;
  inteligentSelected: IInteligent = {};
  popover?: NgbPopover;

  constructor(
    private eventManager: JhiEventManager,
    protected inteligentService: InteligentService,
    protected parceiroService: ParceiroService,
    public spinner: NgxSpinnerService,
    public activatedRoute: ActivatedRoute,
    public fileService: UploadService,
    public contaService: ContaService,
    public regraService: RegraService,
    public authServerProvider: AuthServerProvider
  ) {
    this.registerParceiroListener();
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parceiro }) => {
      this.parceiro = parceiro;
      if (!parceiro) {
        this.parceiro = this.parceiroService.getParceiroSelected();
      }
      this.loadPeriodo();
    });
  }

  ngOnDestroy(): void {
    if (this.parceiroListener) {
      this.eventManager.destroy(this.parceiroListener);
    }
  }

  private loadPeriodo(): void {
    if (this.parceiro?.agenciabancarias) {
      this.agenciaSelected = this.parceiro?.agenciabancarias[0];
      if (this.agenciaSelected) {
        this.inteligentService
          .queryPeriodo({
            parceiroId: this.parceiro?.id,
            agenciabancariaId: this.agenciaSelected.id,
          })
          .subscribe(response => {
            if (response.body) {
              this.initDate(response.body);
              this.loadData();
            }
          });
      }
    }
  }

  private loadData(): void {
    const queryParam = {
      'parceiroId.equals': this.parceiro?.id,
      'periodo.equals': this.mesSelected + '' + this.anoSelected,
      sort: ['datalancamento,asc'],
    };
    if (this.agenciaSelected) {
      queryParam['agenciabancariaId.equals'] = this.agenciaSelected?.id;
    }
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
    this.regra.tipoRegra = this.tipoRegraSelected.tipoRegra?.toString();
    this.regra.regDescricao = this.tipoRegraSelected.regDescricao;
    this.regra.parceiro = this.parceiro;
    this.regra.conta = this.contaSelected;
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
  }

  onChangeMes(): void {
    this.loadData();
  }
  onChangeAno(): void {
    this.loadData();
  }
  private initDate(periodos: string[]): void {
    periodos.forEach(periodo => {
      const _ano = periodo.substring(periodo.length - 4);
      const _month = periodo.split(_ano)[0];
      this.anos.push(+_ano);
      this.meses.push(+_month);
    });
    this.anoSelected = this.anos[0];
    this.mesSelected = this.meses[0];
  }

  private registerParceiroListener(): void {
    this.parceiroListener = this.eventManager.subscribe('parceiroSelected', (response: JhiEventWithContent<IParceiro>) => {
      this.parceiro = response.content;
      this.loadPeriodo();
    });
  }

  selectConta(inteligent: IInteligent, popover: NgbPopover): void {
    this.inteligentSelected = inteligent;
    if (popover.isOpen()) {
      popover.close();
    } else {
      popover.open({ popover });
    }
    this.popover = popover;
  }

  saveConta(): void {
    if (this.inteligentSelected) {
      this.inteligentSelected.associado = true;
      this.inteligentSelected.parceiro = this.parceiro;
      this.inteligentSelected.agenciabancaria = this.agenciaSelected;
      this.inteligentSelected.conta = this.contaSelected;
      this.inteligentService.create(this.inteligentSelected).subscribe(response => {
        this.cancelConta();
        this.loadData();
      });
    }
  }
  cancelConta(): void {
    this.contaSelected = undefined;
    this.inteligentSelected = {};
    if (this.popover) {
      this.popover.close();
    }
  }

  onChangeTipoRegra(event: any): void {
    this.tipoRegraSelected = this.tipoRegras.filter(value => value.regDescricao === event)[0];
  }

  selectInteligent(inteligent: IInteligent, popover: NgbPopover): void {
    this.regra = new Regra();
    this.regra.regHistorico = '';
    this.tipoRegras = [];
    const tipoRegraDefault = { tipoRegra: null, regDescricao: 'Selecione ..' };
    this.tipoRegras.push(tipoRegraDefault);
    this.tipoRegraSelected = tipoRegraDefault;
    if (inteligent.extrato?.infoAdicional) {
      this.tipoRegras.push({ tipoRegra: TipoRegra.INFORMACAO_ADICIONAL, regDescricao: inteligent.extrato?.infoAdicional });
    }
    if (inteligent.beneficiario) {
      this.tipoRegras.push({ tipoRegra: TipoRegra.BENEFICIARIO, regDescricao: inteligent.beneficiario });
    }
    this.tipoRegras.push({ tipoRegra: TipoRegra.HISTORICO, regDescricao: inteligent?.historico });
    if (popover.isOpen()) {
      popover.close();
    } else {
      popover.open({ popover });
    }
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
    if (TipoSistema[sistema] === TipoSistema.DOMINIO_SISTEMAS && this.parceiro?.codExt) {
      const _url =
        this.resourceUrlLancamento +
        this.mesSelected +
        '' +
        this.anoSelected +
        '/' +
        this.agenciaSelected?.id +
        '/' +
        this.parceiro?.id +
        '/' +
        this.parceiro?.codExt +
        '/' +
        sistema;
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
}
