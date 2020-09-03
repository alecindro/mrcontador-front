import { Component, OnInit, OnDestroy } from '@angular/core';
import { ComprovanteUploadComponent } from './comprovante-upload.component';
import { IComprovante } from 'app/shared/model/comprovante.model';
import { ComprovanteService } from 'app/entities/comprovante/comprovante.service';
import { Subscription, combineLatest } from 'rxjs';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { IParceiro } from 'app/shared/model/parceiro.model';
import { ActivatedRoute, Router, Data, ParamMap } from '@angular/router';
import { JhiEventManager, JhiEventWithContent } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParceiroService } from 'app/entities/parceiro/parceiro.service';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { IAgenciabancaria } from 'app/shared/model/agenciabancaria.model';
import * as moment from 'moment';
import { MesAnoDTO } from 'app/shared/dto/mesAnoDTO';
import { MESES, MESLABELS } from 'app/shared/constants/input.constants';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'jhi-comprovante',
  templateUrl: './comprovante.component.html',
  styleUrls: ['./comprovante.component.scss'],
})
export class ComprovanteComponent implements OnInit, OnDestroy {
  parceiroListener!: Subscription;
  comprovantes?: IComprovante[];
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

  constructor(
    protected comprovanteService: ComprovanteService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parceiroService: ParceiroService,
    public spinner: NgxSpinnerService
  ) {
    this.registerParceiroListener();
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.spinner.show();
    const pageToLoad: number = page || this.page || 1;
    const queryParam: any = {
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
      queryParam['comDatapagamento.lessThanOrEqual'] = _end.format('YYYY-MM-DD');
      queryParam['comDatapagamento.greaterThanOrEqual'] = _begin.format('YYYY-MM-DD');
    }
    this.comprovanteService.query(queryParam).subscribe(
      (res: HttpResponse<IComprovante[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
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
    this.registerChangeInComprovantes();
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

  trackId(index: number, item: IComprovante): number {
    return item.id!;
  }

  registerChangeInComprovantes(): void {
    this.eventSubscriber = this.eventManager.subscribe('comprovateUpload', () => this.loadPage());
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: IComprovante[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.spinner.hide();
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate([`/onboard/${this.parceiro.id}/comprovante`], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.comprovantes = data || [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.spinner.hide();
    this.ngbPaginationPage = this.page ?? 1;
  }

  upload(): void {
    const modalRef = this.modalService.open(ComprovanteUploadComponent, { size: 'xl', backdrop: 'static' });
    modalRef.componentInstance.parceiro = this.parceiro;
  }
  onChangeAgencia(): void {
    this.loadPage(this.page, true);
  }

  onChangeMes(): void {
    this.loadPage(this.page, true);
  }
  onChangeAno(): void {
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
}
