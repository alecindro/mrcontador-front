import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import { JhiEventManager, JhiEventWithContent } from 'ng-jhipster';
import { MesAnoDTO } from 'app/shared/dto/mesAnoDTO';
import { IInteligent } from 'app/model/inteligent.model';
import { MESES, MESLABELS } from 'app/shared/constants/input.constants';
import { InteligentService } from 'app/services/inteligent.service';
import { ParceiroService } from 'app/services/parceiro.service';
import { IParceiro } from 'app/model/parceiro.model';
import { IAgenciabancaria } from 'app/model/agenciabancaria.model';
import { HttpResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { IRegra, Regra } from 'app/model/regra.model';
import { SERVER_API_URL } from 'app/app.constants';
import { UploadService } from 'app/shared/file/file-upload.service ';
import { IComprovante } from 'app/model/comprovante.model';
import { INotafiscal } from 'app/model/notafiscal.model';
import { ContaService } from 'app/services/conta.service';
import { IConta } from 'app/model/conta.model';
import { TipoRegra } from 'app/shared/constants/TipoRegra.constants';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError, map } from 'rxjs/operators';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { RegraService } from 'app/services/regra.service';

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
  readonly meses = MESES;
  readonly mesLabels = MESLABELS;
  anos: number[] = [];
  anoSelected?: number;
  mesSelected?: number;
  parceiro?: IParceiro;
  agenciaSelected?: IAgenciabancaria;
  resourceUrl = SERVER_API_URL + 'api/downloadFile/comprovante/';
  resourceUrlNfe = SERVER_API_URL + 'api/downloadFile/notafiscal/';
  tipoRegras: { tipoRegra?: TipoRegra; regDescricao?: string }[] = [];
  tipoRegraSelected: { tipoRegra?: TipoRegra; regDescricao?: string } = {};
  contaSelected: any;
  popover?: NgbPopover;

  constructor(
    private eventManager: JhiEventManager,
    protected inteligentService: InteligentService,
    protected parceiroService: ParceiroService,
    public spinner: NgxSpinnerService,
    public activatedRoute: ActivatedRoute,
    public fileService: UploadService,
    public contaService: ContaService,
    public regraService: RegraService
  ) {
    this.registerParceiroListener();
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parceiro }) => {
      this.parceiro = parceiro;
      if (!parceiro) {
        this.parceiro = this.parceiroService.getParceiroSelected();
      }
      this.initDate();
      if (this.parceiro?.agenciabancarias) {
        this.agenciaSelected = this.parceiro?.agenciabancarias[0];
        this.loadData();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.parceiroListener) {
      this.eventManager.destroy(this.parceiroListener);
    }
  }

  public processConsolidacao(): void {
    const queryParam = {
      parceiroId: this.parceiro?.id,
      periodo: this.mesSelected + '' + this.anoSelected,
      agenciabancariaId: this.agenciaSelected?.id,
    };
    this.spinner.show();
    this.inteligentService.queryFuntion(queryParam).subscribe(
      res => {
        this.spinner.hide();
        this.loadData();
        console.log(res);
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  private loadData(): void {
    this.loadDivergencias();
    this.loadConciliados();
  }

  private loadDivergencias(): void {
    const queryParam = {
      'parceiroId.equals': this.parceiro?.id,
      'periodo.equals': this.mesSelected + '' + this.anoSelected,
      'associado.equals': false,
      sort: ['datalancamento,asc'],
    };
    if (this.agenciaSelected) {
      queryParam['agenciabancariaId.equals'] = this.agenciaSelected?.id;
    }
    this.spinner.show();
    this.inteligentService.query(queryParam).subscribe(
      (res: HttpResponse<IInteligent[]>) => {
        this.divergencias = res.body || [];
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
    this.regra.conta = this.contaSelected.conConta;
    this.regraService.create(this.regra).subscribe(response => {
      console.log(response);
      this.cancelRegra();
      this.loadData();
    });
  }
  cancelRegra(): void {
    if (this.popover) {
      this.popover.close();
    }
  }

  private loadConciliados(): void {
    const queryParam = {
      'parceiroId.equals': this.parceiro?.id,
      'periodo.equals': this.mesSelected + '' + this.anoSelected,
      'associado.equals': true,
      sort: ['datalancamento,asc'],
    };
    if (this.agenciaSelected) {
      queryParam['agenciabancariaId.equals'] = this.agenciaSelected?.id;
    }
    this.inteligentService.query(queryParam).subscribe(
      (res: HttpResponse<IInteligent[]>) => {
        this.conciliados = res.body || [];
        this.spinner.hide();
      },
      (err: any) => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  onChangeAgencia(): void {
    this.loadData();
  }

  onChangeMes(): void {
    this.loadData();
  }
  onChangeAno(): void {
    this.loadData();
  }
  private initDate(): void {
    const data = new Date();
    for (let i = 0; i < 5; i++) {
      this.anos.push(data.getFullYear() - i);
    }
    this.anoSelected = this.anos[0];
    this.mesSelected = this.meses[data.getMonth()];
  }

  private registerParceiroListener(): void {
    this.parceiroListener = this.eventManager.subscribe('parceiroSelected', (response: JhiEventWithContent<IParceiro>) => {
      this.parceiro = response.content;
      this.initDate();
      if (this.parceiro?.agenciabancarias) {
        this.agenciaSelected = this.parceiro?.agenciabancarias[0];
        this.loadData();
      }
    });
  }

  selectInteligent(inteligent: IInteligent, popover: NgbPopover): void {
    this.regra = new Regra();
    this.regra.regHistorico = '';
    this.tipoRegras = [];
    if (inteligent.extrato?.infoAdicional) {
      this.tipoRegras.push({ tipoRegra: TipoRegra.INFORMACAO_ADICIONAL, regDescricao: inteligent.extrato?.infoAdicional });
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

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.spinner.show()),
      switchMap(term => {
        if (term) {
          return this.contaService
            .query({ 'conConta.greaterThanOrEqual': term, sort: ['conConta,asc'], page: 0, size: 10 })
            .pipe(map(response => response.body || of([])))
            .pipe(
              tap(() => this.spinner.hide()),
              catchError(() => {
                this.spinner.hide();
                return of([]);
              })
            );
        }
        return of('');
      }),
      tap(() => this.spinner.hide())
    );

  contaFormatter = (conta: IConta) => conta?.conConta + ' -  ' + conta?.conClassificacao + ' -  ' + conta?.conDescricao || '';
}
