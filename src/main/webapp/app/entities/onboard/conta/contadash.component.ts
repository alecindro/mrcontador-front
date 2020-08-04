import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { Parceiro, IParceiro } from 'app/shared/model/parceiro.model';
import { MesAnoDTO } from 'app/shared/dto/mesAnoDTO';
import { JhiEventManager, JhiEventWithContent } from 'ng-jhipster';
import { ParceiroService } from 'app/entities/parceiro/parceiro.service';
import { ContaService } from 'app/entities/conta/conta.service';
import { IConta } from 'app/shared/model/conta.model';
import { HttpResponse, HttpHeaders, HttpEventType } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { Router, ActivatedRoute, ParamMap, Data } from '@angular/router';
import { UploadService } from 'app/shared/file/file-upload.service ';

@Component({
  selector: 'jhi-dash-conta',
  templateUrl: './contadash.component.html',
  styleUrls: ['./contadash.component.scss'],
})
export class ContaDashComponent implements OnInit, OnDestroy {
  progressInfo: any = {};
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

  constructor(
    private eventManager: JhiEventManager,
    private parceiroService: ParceiroService,
    private contaService: ContaService,
    public spinner: NgxSpinnerService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected uploadService: UploadService
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
    this.loadPage(1, true);
  }

  pesquisar(): void {
    this.onChange();
  }

  onError(): void {
    this.spinner.hide();
  }

  ngOnDestroy(): void {}

  removeFile(): void {
    this.progressInfo.file = undefined;
    this.progressInfo = {};
  }

  allowDrop(ev: any): void {
    ev.preventDefault();
  }

  drop(ev: any): void {
    ev.preventDefault();
    ev.target.files = ev.dataTransfer.files;
    this.selectFile(ev);
  }

  selectFile(event: any): void {
    event.preventDefault();
    this.progressInfo = { value: 0, fileName: event.target.files[0].name, file: event.target.files[0] };
  }

  upload(): void {
    this.message = '';
    if (this.progressInfo.file) {
      this.spinner.show();
      const queryParam: any = {
        parceiroCNPJ: this.parceiro?.parCnpjcpf,
      };
      this.uploadService.uploadFiles(this.progressInfo.file, this.uploadService.planocontasUrl, queryParam).subscribe(
        event => {
          if (event && event.type === HttpEventType.UploadProgress) {
            this.progressInfo.value = Math.round((100 * event.loaded) / event.total);
            this.progressInfo.file = undefined;
          } else if (event instanceof HttpResponse) {
            this.message = event.status.toString();
            this.spinner.hide();
            this.loadPage();
          }
        },
        err => {
          this.message = 'Não foi possivel carregar o arquivo: ' + err;
          this.progressInfo.value = 0;
          this.spinner.hide();
        }
      );
    }
  }
}
