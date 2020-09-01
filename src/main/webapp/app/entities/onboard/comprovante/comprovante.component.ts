import { Component, OnInit, OnDestroy } from '@angular/core';
import { ComprovanteUploadComponent } from './comprovante-upload.component';
import { IComprovante } from 'app/shared/model/comprovante.model';
import { ComprovanteService } from 'app/entities/comprovante/comprovante.service';
import { Subscription, combineLatest } from 'rxjs';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { IParceiro } from 'app/shared/model/parceiro.model';
import { ActivatedRoute, Router, Data, ParamMap } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ParceiroService } from 'app/entities/parceiro/parceiro.service';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { IAgenciabancaria } from 'app/shared/model/agenciabancaria.model';
import * as moment from 'moment';

@Component({
  selector: 'jhi-comprovante',
  templateUrl: './comprovante.component.html',
  styleUrls: ['./comprovante.component.scss'],
})
export class ComprovanteComponent implements OnInit, OnDestroy {
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
  hoveredDate: NgbDate | null = null;
  fromDate!: NgbDate | null;
  toDate!: NgbDate | null;

  constructor(
    protected comprovanteService: ComprovanteService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parceiroService: ParceiroService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter
  ) {
    this.toDate = calendar.getToday();
    this.fromDate = new NgbDate(this.toDate.year, this.toDate.month, 1);
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
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
    if (this.fromDate) {
      queryParam['comDatapagamento.greaterThan'] = this.formatter.format(this.fromDate);
    }
    if (this.toDate) {
      queryParam['comDatapagamento.lessThanOrEqual'] = this.formatter.format(this.toDate);
    }
    this.comprovanteService.query(queryParam).subscribe(
      (res: HttpResponse<IComprovante[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
      () => this.onError()
    );
  }

  ngOnInit(): void {
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
    this.ngbPaginationPage = this.page ?? 1;
  }

  upload(): void {
    const modalRef = this.modalService.open(ComprovanteUploadComponent, { size: 'xl', backdrop: 'static' });
    modalRef.componentInstance.parceiro = this.parceiro;
  }
  onChangeAgencia(): void {
    this.loadPage(this.page, true);
  }

  onDateSelection(date: NgbDate): void {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    this.loadPage(this.page, true);
  }

  isHovered(date: NgbDate): boolean | null | undefined {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate): boolean | null | undefined {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate): boolean | null | undefined {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
}
