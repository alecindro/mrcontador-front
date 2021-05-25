import { Component, OnInit, OnDestroy } from '@angular/core';
import { IExtrato } from '../../../model/extrato.model';
import { Subscription, combineLatest, Observable } from 'rxjs';
import { ExtratoService } from '../../../services/extrato.service';
import { ActivatedRoute, Router, Data, ParamMap } from '@angular/router';
import { JhiEventManager, JhiEventWithContent, JhiAlertService } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { ParceiroService } from '../../../services/parceiro.service';
import { IParceiro } from '../../../model/parceiro.model';
import { ExtratoUploadComponent } from './extrato-upload.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { IAgenciabancaria } from '../../../model/agenciabancaria.model';
import { UploadService } from '../../../services/file-upload.service';
import { SERVER_API_URL } from '../../../app.constants';
import { TipoAgencia } from '../../../shared/constants/TipoAgencia';
import { AgenciabancariaService } from '../../../services/agenciabancaria.service';
import { LocalStorageService } from 'ngx-webstorage';
import { FormControl } from '@angular/forms';
import { DecimalPipe, DatePipe } from '@angular/common';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'jhi-dash-extrato',
  templateUrl: './extratodash.component.html',
  styleUrls: ['./extratodash.component.scss'],
  providers: [DecimalPipe, DatePipe],
})
export class ExtratoDashComponent implements OnInit, OnDestroy {
  extratoes: IExtrato[] = [];
  parceiroListener!: Subscription;
  eventSubscriber?: Subscription;
  predicate!: string;
  ascending!: boolean;
  parceiro!: IParceiro;
  agenciaSelected?: IAgenciabancaria;
  agencias?: IAgenciabancaria[];
  periodo = '';
  resourceUrl = SERVER_API_URL + 'api/downloadFile/extrato/';
  filter = new FormControl('');
  filterAssociado = '2';
  extratosFilter!: Observable<IExtrato[]>;

  constructor(
    protected extratoService: ExtratoService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parceiroService: ParceiroService,
    public spinner: NgxSpinnerService,
    public fileService: UploadService,
    private alertService: JhiAlertService,
    private agenciabancariaService: AgenciabancariaService,
    private $localStorage: LocalStorageService,
    public pipeDecimal: DecimalPipe,
    public pipeDate: DatePipe
  ) {
    this.registerParceiroListener();
    this.registerChangeInExtratoes();
  }

  public onChangeAssociado(): void {
    this.filter.patchValue('');
  }

  search(text: string): IExtrato[] {
    return this.extratoes.filter(extrato => {
      const term = text.toLowerCase();
      return (
        (this.filterAssociado !== '2' ? extrato.processado?.toString() === this.filterAssociado : true) &&
        (extrato.infoAdicional?.toLowerCase().includes(term) ||
          extrato.extNumerodocumento?.toLowerCase().includes(term) ||
          extrato.extHistorico?.toLowerCase().includes(term) ||
          // @ts-ignore: Object is possibly 'null'.
          this.pipeDate.transform(extrato.extDatalancamento, 'dd/MM/yyyy').includes(term) ||
          // @ts-ignore: Object is possibly 'null'.
          (extrato.extDebito
            ? this.pipeDecimal.transform(extrato.extDebito).includes(term)
            : this.pipeDecimal.transform(extrato.extCredito).includes(term)))
      );
    });
  }

  loadPage(dontNavigate?: boolean): void {
    this.spinner.show();
    const queryParam = {
      sort: this.sort(),
      'parceiroId.equals': this.parceiro.id,
    };
    if (this.agenciaSelected) {
      queryParam['agenciabancariaId.equals'] = this.agenciaSelected?.id;
    }
    if (this.periodo !== '') {
      queryParam['periodo.equals'] = this.periodo;
    }
    this.extratoService.query(queryParam).subscribe(
      (res: HttpResponse<IExtrato[]>) => this.onSuccess(res.body, res.headers, !dontNavigate),
      () => this.onError()
    );
  }

  ngOnInit(): void {
    this.parceiro = this.parceiroService.getParceiroSelected();
    this.periodo = this.$localStorage.retrieve('periodo');
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
        this.agencias = agencias;
        this.agenciaSelected = agencias.filter(agencia => {
          return agencia.id === this.agenciabancariaService.getAgenciaSelected();
        })[0];
        this.handleNavigation();
      });
    }
  }

  protected handleNavigation(): void {
    combineLatest(this.activatedRoute.data, this.activatedRoute.queryParamMap, (data: Data, params: ParamMap) => {
      const sort = (params.get('sort') ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === 'asc';
      if (predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(true);
      }
    }).subscribe();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
    if (this.parceiroListener) {
      this.eventManager.destroy(this.parceiroListener);
    }
  }

  trackId(index: number, item: IExtrato): number {
    return item.id!;
  }

  registerChangeInExtratoes(): void {
    this.eventSubscriber = this.eventManager.subscribe('fileUpload', (response: JhiEventWithContent<string>) => {
      if (response.content != '') {
        this.alertService.success('mrcontadorFrontApp.extrato.uploaded');
      }
      this.loadPage();
    });
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: IExtrato[] | null, headers: HttpHeaders, navigate: boolean): void {
    if (navigate) {
      this.router.navigate(['onboard/extrato'], {
        queryParams: {
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
          'parceiroId.equals': this.parceiro.id,
        },
      });
    }
    this.extratoes = data || [];
    this.filterAssociado = '2';
    this.filter.patchValue('');
    this.extratosFilter = this.filter.valueChanges.pipe(
      startWith(''),
      map(text => this.search(text))
    );
    this.spinner.hide();
  }

  protected onError(): void {
    this.spinner.hide();
  }

  onChangeAgencia(): void {
    this.agenciabancariaService.setAgenciaSelected(this.agenciaSelected || {});
    this.loadPage(true);
  }

  public selectPeriodo(value: string): void {
    this.periodo = value;
    this.$localStorage.store('periodo', this.periodo);
    this.loadPage(true);
  }

  private registerParceiroListener(): void {
    this.parceiroListener = this.eventManager.subscribe('parceiroSelected', () => {
      this.parceiro = this.parceiroService.getParceiroSelected();
      if (this.parceiro?.agenciabancarias) {
        this.agencias = this.parceiro?.agenciabancarias.filter(ag => ag.tipoAgencia === TipoAgencia[TipoAgencia.CONTA]);
        if (this.agencias.length > 0) {
          this.agenciaSelected = this.agencias[0];
        }
        this.onChangeAgencia();
      }
    });
  }

  upload(): void {
    const modalRef = this.modalService.open(ExtratoUploadComponent, { size: 'xl', backdrop: 'static', scrollable: true });
    modalRef.componentInstance.parceiroId = this.parceiro?.id;
    modalRef.componentInstance.agenciaId = this.agenciaSelected?.id;
  }

  public download(extrato: IExtrato): void {
    if (extrato.arquivo) {
      const contentType = extrato.arquivo.tipoArquivo;
      this.fileService.downloadFile(this.resourceUrl + extrato.id).subscribe(
        response => {
          const blob: any = new Blob([response], { type: contentType });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        },
        error => console.log('Error downloading the file', error),
        () => console.info('File downloaded successfully')
      );
    }
  }
}
