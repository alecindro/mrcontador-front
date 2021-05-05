import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router, Data } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { JhiEventManager, JhiEventWithContent } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IRegra, Regra } from 'app/model/regra.model';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { RegraService } from 'app/services/regra.service';
import { RegraUpdateComponent } from './regra-update.component';
import { IParceiro } from 'app/model/parceiro.model';
import { ParceiroService } from 'app/services/parceiro.service';
import { RegraDeleteDialogComponent } from './regra-delete-dialog.component';

@Component({
  selector: 'jhi-regra',
  templateUrl: './regra.component.html',
})
export class RegraComponent implements OnInit, OnDestroy {
  regras?: IRegra[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  parceiro!: IParceiro;
  parceiroListener!: Subscription;
  regraListener!: Subscription;

  constructor(
    protected regraService: RegraService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parceiroService: ParceiroService
  ) {
    this.registerParceiroListener();
    this.registerChangeInRegras();
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    const pageToLoad: number = page || this.page || 1;

    this.regraService
      .query({
        'parceiroId.equals': this.parceiro.id,
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IRegra[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
        () => this.onError()
      );
  }

  ngOnInit(): void {
    this.parceiro = this.parceiroService.getParceiroSelected();
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

  trackId(index: number, item: IRegra): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInRegras(): void {
    this.eventSubscriber = this.eventManager.subscribe('regraUpdate', () => this.loadPage());
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: IRegra[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/onboard/regra'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.regras = data || [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }

  private registerParceiroListener(): void {
    this.parceiroListener = this.eventManager.subscribe('parceiroSelected', (response: JhiEventWithContent<IParceiro>) => {
      this.parceiro = response.content;
    });
  }

  edit(regra: IRegra): void {
    const modalRef = this.modalService.open(RegraUpdateComponent, { size: 'xl', backdrop: 'static' });
    modalRef.componentInstance.parceiro = this.parceiro;
    modalRef.componentInstance.regra = regra;
  }

  delete(regra: IRegra): void {
    const modalRef = this.modalService.open(RegraDeleteDialogComponent, { size: 'xl', backdrop: 'static' });
    modalRef.componentInstance.regra = regra;
  }
  new(): void {
    this.edit(new Regra());
  }
}
