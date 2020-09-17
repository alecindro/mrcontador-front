import { Component, OnInit, OnDestroy } from '@angular/core';
import { IAgenciabancaria, Agenciabancaria } from 'app/shared/model/agenciabancaria.model';
import { Subscription, combineLatest } from 'rxjs';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { AgenciabancariaService } from 'app/entities/agenciabancaria/agenciabancaria.service';
import { ActivatedRoute, Router, Data, ParamMap } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { AgenciabancariaDeleteDialogComponent } from 'app/entities/onboard/agencia/agenciabancaria-delete-dialog.component';
import { IParceiro } from 'app/shared/model/parceiro.model';
import { ParceiroService } from 'app/entities/parceiro/parceiro.service';

@Component({
  selector: 'jhi-agenciadash',
  templateUrl: './agenciadash.component.html',
  styleUrls: ['./agenciadash.component.scss'],
})
export class AgenciaDashComponent implements OnInit, OnDestroy {
  agenciabancarias?: IAgenciabancaria[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  parceiro!: IParceiro;

  constructor(
    protected agenciabancariaService: AgenciabancariaService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parceiroService: ParceiroService
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    const pageToLoad: number = page || this.page || 1;
    const queryParam = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      sort: this.sort(),
      'parceiroId.equals': this.parceiro.id,
    };
    this.agenciabancariaService.query(queryParam).subscribe(
      (res: HttpResponse<IAgenciabancaria[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
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
  }

  trackId(index: number, item: IAgenciabancaria): number {
    return item.id!;
  }

  delete(agenciabancaria: IAgenciabancaria): void {
    const modalRef = this.modalService.open(AgenciabancariaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.agenciabancaria = agenciabancaria;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: IAgenciabancaria[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate([`/onboard/${this.parceiro.id}/agencia`], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.agenciabancarias = data || [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }

  public newAgencia(): void {
    this.agenciabancariaService.setAgenciaSelected(new Agenciabancaria());
    this.router.navigate([`/onboard/${this.parceiro.id}/agenciaNew`]);
  }
  public edit(agenciabancaria: IAgenciabancaria): void {
    this.agenciabancariaService.setAgenciaSelected(agenciabancaria);
    this.router.navigate([`/onboard/${this.parceiro.id}/agenciaNew`]);
  }
}
