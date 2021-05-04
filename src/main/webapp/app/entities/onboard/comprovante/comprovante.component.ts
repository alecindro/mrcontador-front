import { Component, OnInit, OnDestroy } from '@angular/core';
import { ComprovanteUploadComponent } from './comprovante-upload.component';
import { IComprovante } from '../../../model/comprovante.model';
import { ComprovanteService } from '../../../services/comprovante.service';
import { Subscription, combineLatest } from 'rxjs';
import { ITEMS_PER_PAGE } from '../../../shared/constants/pagination.constants';
import { IParceiro } from '../../../model/parceiro.model';
import { ActivatedRoute, Router, Data, ParamMap } from '@angular/router';
import { JhiEventManager, JhiEventWithContent, JhiAlertService } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParceiroService } from '../../../services/parceiro.service';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { IAgenciabancaria } from '../../../model/agenciabancaria.model';

import { NgxSpinnerService } from 'ngx-spinner';
import { SERVER_API_URL } from '../../../app.constants';
import { UploadService } from '../../../services/file-upload.service';
import { TipoAgencia } from '../../../shared/constants/TipoAgencia';
import { AgenciabancariaService } from '../../../services/agenciabancaria.service';

@Component({
  selector: 'jhi-comprovante',
  templateUrl: './comprovante.component.html',
  styleUrls: ['./comprovante.component.scss'],
})
export class ComprovanteComponent implements OnInit, OnDestroy {
  resourceUrl = SERVER_API_URL + 'api/downloadFile/comprovante/';
  parceiroListener!: Subscription;
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
  periodo = '';
  agencias?: IAgenciabancaria[];

  constructor(
    protected comprovanteService: ComprovanteService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parceiroService: ParceiroService,
    public spinner: NgxSpinnerService,
    public fileService: UploadService,
    private alertService: JhiAlertService,
    private agenciabancariaService: AgenciabancariaService
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.spinner.show();
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
    if (this.periodo !== '') {
      queryParam['periodo.equals'] = this.periodo;
    }
    this.comprovanteService.query(queryParam).subscribe(
      (res: HttpResponse<IComprovante[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
      () => this.onError()
    );
  }

  ngOnInit(): void {
    this.parceiro = this.parceiroService.getParceiroSelected();
    this.registerChangeInComprovantes();
    this.loadAgencias();
  }

  private loadAgencias() {
    if (this.parceiro) {
      const queryParam = {
        'parceiroId.equals': this.parceiro?.id,
        'ageSituacao.equals': 1,
      };
      this.agenciabancariaService.query(queryParam).subscribe((res: HttpResponse<IAgenciabancaria[]>) => {
        const _agencias = res.body || [];
        const agencias = _agencias?.filter(agencia => {
          return agencia.ageSituacao === true && agencia.tipoAgencia === TipoAgencia[TipoAgencia.CONTA];
        });
        this.agencias = agencias;
        this.agenciaSelected = agencias.filter(agencia => {
          return agencia.id === this.agenciabancariaService.getAgenciaSelected();
        })[0];
        this.handleNavigation();
      });
    }
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

  trackId(index: number, item: IComprovante): number {
    return item.id!;
  }

  registerChangeInComprovantes(): void {
    this.eventSubscriber = this.eventManager.subscribe('fileUpload', (response: JhiEventWithContent<string>) => {
      if (response.content != '') {
        this.alertService.success('mrcontadorFrontApp.comprovante.uploaded');
      }
      this.periodo = '';
      this.loadPage();
    });
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    return result;
  }

  protected onSuccess(data: IComprovante[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/onboard/comprovante'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }

    this.comprovantes = data || [];
    this.periodo = this.comprovantes.length > 0 ? this.comprovantes[0].periodo || '' : '';
    this.ngbPaginationPage = this.page;
    this.spinner.hide();
  }

  protected onError(): void {
    this.spinner.hide();
    this.ngbPaginationPage = this.page ?? 1;
  }

  upload(): void {
    const modalRef = this.modalService.open(ComprovanteUploadComponent, { size: 'xl', backdrop: 'static', scrollable: true });
    modalRef.componentInstance.parceiroId = this.parceiro?.id;
    modalRef.componentInstance.agenciaId = this.agenciaSelected?.id;
  }
  onChangeAgencia(): void {
    this.page = 0;
    this.agenciabancariaService.setAgenciaSelected(this.agenciaSelected || {});
    this.loadPage(this.page, true);
  }

  public selectPeriodo(value: string): void {
    this.periodo = value;
    this.loadPage(this.page, true);
  }

  public downloadComprovante(comprovante: IComprovante): void {
    this.fileService.downloadFile(this.resourceUrl + comprovante.id).subscribe(
      response => {
        const blob: any = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      },
      error => console.log('Error downloading the file', error),
      () => console.info('File downloaded successfully')
    );
  }
}
