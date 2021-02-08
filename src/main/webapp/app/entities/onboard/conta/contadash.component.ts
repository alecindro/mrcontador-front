import { Component, OnInit, OnDestroy } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { IParceiro } from '../../../model/parceiro.model';
import { MesAnoDTO } from '../../../shared/dto/mesAnoDTO';
import { ParceiroService } from '../../../services/parceiro.service';
import { ContaService } from '../../../services/conta.service';
import { IConta } from '../../../model/conta.model';
import { HttpResponse, HttpHeaders, HttpEventType } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ITEMS_PER_PAGE } from '../../../shared/constants/pagination.constants';
import { Router, ActivatedRoute, ParamMap, Data } from '@angular/router';
import { UploadService } from '../../../services/file-upload.service';
import { JhiEventManager, JhiEventWithContent, JhiAlertService } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContaUploadComponent } from './conta-upload.component';

@Component({
  selector: 'jhi-dash-conta',
  templateUrl: './contadash.component.html',
  styleUrls: ['./contadash.component.scss'],
})
export class ContaDashComponent implements OnInit, OnDestroy {
  message = '';
  mesAno!: MesAnoDTO;
  contas?: IConta[];
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  parceiro?: IParceiro;
  pesquisa?: any;
  selected = 'conClassificacao.contains';
  eventSubscriber?: Subscription;

  constructor(
    private parceiroService: ParceiroService,
    private contaService: ContaService,
    public spinner: NgxSpinnerService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected uploadService: UploadService,
    public eventManager: JhiEventManager,
    private alertService: JhiAlertService,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.parceiro = this.parceiroService.getParceiroSelected();
    this.handleNavigation();
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    const pageToLoad: number = page || this.page || 1;
    this.spinner.show();
    const queryParam: any = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      sort: this.sort(),
    };
    if (this.parceiro) {
      queryParam['parceiroId.equals'] = this.parceiro.id;
    }
    if (this.pesquisa) {
      queryParam[this.selected] = this.pesquisa;
    }
    this.contaService.query(queryParam).subscribe(
      (res: HttpResponse<IConta[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
      () => this.onError()
    );
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

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  trackId(index: number, item: IConta): number {
    return item.id!;
  }

  protected onSuccess(data: IConta[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate([`/onboard/${this.parceiro?.id}/conta`], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.spinner.hide();
    this.contas = data || [];
    this.ngbPaginationPage = this.page;
  }

  onChange(): void {
    if (this.pesquisa) {
      this.loadPage(1, true);
    }
  }

  pesquisar(): void {
    this.loadPage(1, true);
  }

  onError(): void {
    this.spinner.hide();
  }

  ngOnDestroy(): void {}

  upload(): void {
    const modalRef = this.modalService.open(ContaUploadComponent, { size: 'xl', backdrop: 'static', scrollable: true });
    modalRef.componentInstance.parceiro = this.parceiro;
  }

  registerChangeInComprovantes(): void {
    this.eventSubscriber = this.eventManager.subscribe('contaUpload', (response: JhiEventWithContent<string>) => {
      if (response.content != '') {
        this.alertService.success('mrcontadorFrontApp.conta.uploaded');
      }
      this.loadPage();
    });
  }
}
