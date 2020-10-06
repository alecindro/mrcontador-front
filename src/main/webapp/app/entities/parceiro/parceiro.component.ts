import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, Data } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IParceiro } from 'app/model/parceiro.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { ParceiroService } from '../../services/parceiro.service';
import { ParceiroDeleteDialogComponent } from './parceiro-delete-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'jhi-parceiro',
  templateUrl: './parceiro.component.html',
})
export class ParceiroComponent implements OnInit, OnDestroy {
  parceiros?: IParceiro[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  pesquisa?: any;
  selected = 'par_razaosocial.contains';

  constructor(
    protected parceiroService: ParceiroService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    const pageToLoad: number = page || this.page || 1;

    const queryParam: any = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      sort: this.sort(),
    };
    if (this.pesquisa) {
      queryParam[this.selected] = this.pesquisa;
    }
    this.spinner.show();
    this.parceiroService.query(queryParam).subscribe(
      (res: HttpResponse<IParceiro[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
      () => this.onError()
    );
  }

  ngOnInit(): void {
    this.handleNavigation();
    this.registerChangeInParceiros();
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

  trackId(index: number, item: IParceiro): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInParceiros(): void {
    this.eventSubscriber = this.eventManager.subscribe('parceiroListModification', () => this.loadPage());
  }

  delete(parceiro: IParceiro): void {
    const modalRef = this.modalService.open(ParceiroDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.parceiro = parceiro;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: IParceiro[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/parceiro'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.spinner.hide();
    this.parceiros = data || [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.spinner.hide();
    this.ngbPaginationPage = this.page ?? 1;
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
