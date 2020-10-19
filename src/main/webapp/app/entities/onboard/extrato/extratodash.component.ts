import { Component, OnInit, OnDestroy } from '@angular/core';
import { IExtrato } from '../../../model/extrato.model';
import { Subscription, combineLatest } from 'rxjs';
import { ITEMS_PER_PAGE } from '../../../shared/constants/pagination.constants';
import { ExtratoService } from '../../../services/extrato.service';
import { ActivatedRoute, Router, Data, ParamMap } from '@angular/router';
import { JhiEventManager, JhiEventWithContent } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { ParceiroService } from '../../../services/parceiro.service';
import { IParceiro } from '../../../model/parceiro.model';
import { ExtratoUploadComponent } from './extrato-upload.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { IAgenciabancaria } from '../../../model/agenciabancaria.model';
import { MesAnoDTO } from '../../../shared/dto/mesAnoDTO';
import { MESES, MESLABELS } from '../../../shared/constants/input.constants';
import * as moment from 'moment';
import { UploadService } from '../../../services/file-upload.service';
import { SERVER_API_URL } from '../../../app.constants';

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
  mesAno!: MesAnoDTO;
  readonly meses = MESES;
  readonly mesLabels = MESLABELS;
  anos: number[] = [];
  anoSelected?: number;
  mesSelected?: number;
  resourceUrl = SERVER_API_URL + 'api/downloadFile/extrato/';

  constructor(
    protected extratoService: ExtratoService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parceiroService: ParceiroService,
    public spinner: NgxSpinnerService,
    public fileService: UploadService
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
    const _begin = moment();
    const _end = moment();
    if (this.anoSelected) {
      _begin.set('year', this.anoSelected).format();
      _begin.set('month', 0).format();
      _begin.set('date', 1).format();
      _end.set('year', this.anoSelected).format();
      _end.set('month', 11).format();
      _end.set('date', 31).format();
    }
    if (this.mesSelected) {
      _begin.set('month', this.mesSelected - 1).format();
      _end.set('month', this.mesSelected).format();
      _end.set('date', 1).format();
      _end.add(-1, 'days').format();
    }
    if (this.anoSelected || this.mesSelected) {
      queryParam['extDatalancamento.lessThanOrEqual'] = _end.format('YYYY-MM-DD');
      queryParam['extDatalancamento.greaterThanOrEqual'] = _begin.format('YYYY-MM-DD');
    }
    this.extratoService.query(queryParam).subscribe(
      (res: HttpResponse<IExtrato[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
      () => this.onError()
    );
  }

  ngOnInit(): void {
    this.initDate();
    this.parceiro = this.parceiroService.getParceiroSelected();
    if (this.parceiro?.agenciabancarias) {
      this.agenciaSelected = this.parceiro?.agenciabancarias[0];
    }
    this.handleNavigation();
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
    this.eventSubscriber = this.eventManager.subscribe('extratoUpload', () => this.loadPage());
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
      this.router.navigate([`onboard/${this.parceiro.id}/extrato`], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
          'parceiroId.equals': this.parceiro.id,
        },
      });
    }
    this.extratoes = data || [];
    this.ngbPaginationPage = this.page;
    this.spinner.hide();
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
    this.spinner.hide();
  }

  onChangeAgencia(): void {
    this.page = 0;
    this.loadPage(this.page, true);
  }

  onChangeMes(): void {
    this.page = 0;
    this.loadPage(this.page, true);
  }
  onChangeAno(): void {
    this.page = 0;
    this.loadPage(this.page, true);
  }

  private initDate(): void {
    const data = new Date();
    for (let i = 0; i < 5; i++) {
      this.anos.push(data.getFullYear() - i);
    }
  }

  private registerParceiroListener(): void {
    this.parceiroListener = this.eventManager.subscribe('parceiroSelected', (response: JhiEventWithContent<IParceiro>) => {
      this.parceiro = response.content;
      this.initDate();
      if (this.parceiro?.agenciabancarias) {
        this.agenciaSelected = this.parceiro?.agenciabancarias[0];
        this.onChangeAgencia();
      }
    });
  }

  upload(): void {
    const modalRef = this.modalService.open(ExtratoUploadComponent, { size: 'xl', backdrop: 'static' });
    modalRef.componentInstance.parceiro = this.parceiro;
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
