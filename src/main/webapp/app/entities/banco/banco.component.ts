import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, Data } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBanco } from 'app/model/banco.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { BancoService } from '../../services/banco.service';
import { BancoDeleteDialogComponent } from './banco-delete-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'jhi-banco',
  templateUrl: './banco.component.html',
})
export class BancoComponent implements OnInit, OnDestroy {
  bancos?: IBanco[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  selected = 'ban_descricao.contains';
  pesquisa!: any;
  loading = false;

  constructor(
    protected bancoService: BancoService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    const pageToLoad: number = page || this.page || 1;
    this.loading = true;
    const queryParam: any = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      sort: this.sort(),
    };
    if (this.pesquisa) {
      queryParam[this.selected] = this.pesquisa;
    }
    this.spinner.show();
    this.bancoService.query(queryParam).subscribe(
      (res: HttpResponse<IBanco[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
      () => this.onError()
    );
  }

  ngOnInit(): void {
    this.handleNavigation();
    this.registerChangeInBancos();
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

  trackId(index: number, item: IBanco): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInBancos(): void {
    this.eventSubscriber = this.eventManager.subscribe('bancoListModification', () => this.loadPage());
  }

  delete(banco: IBanco): void {
    const modalRef = this.modalService.open(BancoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.banco = banco;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: IBanco[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/banco'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.spinner.hide();
    this.bancos = data || [];
    this.loading = false;
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
    this.loading = false;
    this.spinner.hide();
  }
  onChange(): void {
    if (this.pesquisa) {
      this.loadPage(1, true);
    }
  }
  pesquisar(): void {
    this.onChange();
  }
}
