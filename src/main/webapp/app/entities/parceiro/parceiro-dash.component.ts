import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, Data } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IParceiro, Parceiro } from '../../model/parceiro.model';

import { ITEMS_DASH_PARCEIRO } from '../../shared/constants/pagination.constants';
import { ParceiroService } from '../../services/parceiro.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParceiroCreateComponent } from './parceiro-create.component';
import { ContadorService } from '../../services/contador.service';
import { AuthServerProvider } from '../../core/auth/auth-jwt.service';
import { InteligentService } from 'app/services/inteligent.service';
import { StatsLine } from 'app/model/inteligentStats.model';

@Component({
  selector: 'jhi-parceiro-dash',
  templateUrl: './parceiro-dash.component.html',
})
export class ParceiroDashComponent implements OnInit, OnDestroy {
  inteligentStatsLines!: StatsLine[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_DASH_PARCEIRO;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  pesquisa?: any;
  selected = 'par_razaosocial.contains';

  constructor(
    protected parceiroService: ParceiroService,
    protected contadorService: ContadorService,
    protected inteligentService: InteligentService,
    protected authServerProvider: AuthServerProvider,
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
    this.inteligentService.queryStats(queryParam).subscribe(
      (res: HttpResponse<StatsLine[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
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

  newParceiro(parceiro?: IParceiro): void {
    const modalRef = this.modalService.open(ParceiroCreateComponent, { size: 'xl', backdrop: 'static', scrollable: true });
    modalRef.componentInstance.parceiro = parceiro;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: StatsLine[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.spinner.hide();
    this.inteligentStatsLines = data || [];
    this.ngbPaginationPage = this.page;
  }

  public selectParceiro(parceiro: Parceiro): void {
    this.parceiroService.setParceiroSelected(parceiro);
    this.router.navigate(['/onboard']);
  }

  protected onError(): void {
    this.spinner.hide();
    this.ngbPaginationPage = this.page ?? 1;
  }

  onChange(): void {
    this.loadPage(1, true);
  }

  pesquisar(): void {
    this.onChange();
  }
}
