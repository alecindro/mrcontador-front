import { Component, OnInit, OnDestroy } from '@angular/core';
import { IExtrato } from 'app/shared/model/extrato.model';
import { Subscription, combineLatest } from 'rxjs';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { ExtratoService } from 'app/entities/extrato/extrato.service';
import { ActivatedRoute, Router, Data, ParamMap } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { ParceiroService } from 'app/entities/parceiro/parceiro.service';
import { IParceiro } from 'app/shared/model/parceiro.model';
import { ExtratoUploadComponent } from './extrato-upload.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'jhi-dash-extrato',
  templateUrl: './extratodash.component.html',
  styleUrls: ['./extratodash.component.scss'],
})
export class ExtratoDashComponent implements OnInit, OnDestroy {
  extratoes?: IExtrato[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  parceiro!: IParceiro;

  constructor(
    protected extratoService: ExtratoService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parceiroService: ParceiroService,
    public spinner: NgxSpinnerService
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    const pageToLoad: number = page || this.page || 1;
    this.spinner.show();
    this.extratoService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
        'parceiroId.equals': this.parceiro.id,
      })
      .subscribe(
        (res: HttpResponse<IExtrato[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
        () => this.onError()
      );
  }

  ngOnInit(): void {
    this.parceiro = this.parceiroService.getParceiroSelected();
    this.handleNavigation();
    this.registerChangeInExtratoes();
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

  upload(): void {
    const modalRef = this.modalService.open(ExtratoUploadComponent, { size: 'xl', backdrop: 'static' });
    modalRef.componentInstance.parceiro = this.parceiro;
  }
}
