import { Component, OnInit, OnDestroy } from '@angular/core';
import { IExtrato } from '../../../model/extrato.model';
import { Subscription, combineLatest } from 'rxjs';
import { ITEMS_PER_PAGE } from '../../../shared/constants/pagination.constants';
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

@Component({
  selector: 'jhi-dash-extrato',
  templateUrl: './extratodash.component.html',
  styleUrls: ['./extratodash.component.scss'],
})
export class ExtratoDashComponent implements OnInit, OnDestroy {
  extratoes?: IExtrato[];
  parceiroListener!: Subscription;
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  parceiro!: IParceiro;
  agenciaSelected?: IAgenciabancaria;
  agencias?: IAgenciabancaria[];
  periodo = '';
  resourceUrl = SERVER_API_URL + 'api/downloadFile/extrato/';
  public isCollapsed = false;

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
    private agenciabancariaService: AgenciabancariaService
  ) {
    this.registerParceiroListener();
    this.registerChangeInExtratoes();
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    const pageToLoad: number = page || this.page || 1;
    this.spinner.show();
    const queryParam = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
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
      (res: HttpResponse<IExtrato[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
      () => this.onError()
    );
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
      const page = params.get('page');
      const pageNumber = page !== null ? +page : 1;
      const sort = (params.get('sort') ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === 'asc';
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
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
      this.periodo = '';
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

  protected onSuccess(data: IExtrato[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['onboard/extrato'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
          'parceiroId.equals': this.parceiro.id,
        },
      });
    }
    this.extratoes = data || [];
    this.periodo = this.extratoes.length > 0 ? this.extratoes[0].periodo || '' : '';
    this.ngbPaginationPage = this.page;
    this.spinner.hide();
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
    this.spinner.hide();
  }

  onChangeAgencia(): void {
    this.page = 0;
    this.agenciabancariaService.setAgenciaSelected(this.agenciaSelected || {});
    this.loadPage(this.page, true);
  }

  public selectPeriodo(value: string): void {
    this.periodo = value;
    this.loadPage(this.page, true);
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
