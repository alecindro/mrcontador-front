import { Component, OnInit, OnDestroy } from '@angular/core';
import { ComprovanteUploadComponent } from './comprovante-upload.component';
import { IComprovante } from 'app/shared/model/comprovante.model';
import { ComprovanteService } from 'app/entities/comprovante/comprovante.service';
import { Subscription, combineLatest } from 'rxjs';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { IParceiro } from 'app/shared/model/parceiro.model';
import { ActivatedRoute, Router, Data, ParamMap } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParceiroService } from 'app/entities/parceiro/parceiro.service';
import { HttpResponse, HttpHeaders } from '@angular/common/http';

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

  constructor(
    protected comprovanteService: ComprovanteService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parceiroService: ParceiroService
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    const pageToLoad: number = page || this.page || 1;

    this.comprovanteService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
        'parceiroId.equals': this.parceiro.id,
      })
      .subscribe(
        (res: HttpResponse<IComprovante[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
        () => this.onError()
      );
  }

  ngOnInit(): void {
    this.parceiro = this.parceiroService.getParceiroSelected();
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
}
