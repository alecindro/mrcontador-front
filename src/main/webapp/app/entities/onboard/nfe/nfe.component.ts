import { Component, OnInit, OnDestroy } from '@angular/core';
import { INotafiscal } from '../../../model/notafiscal.model';
import { Subscription, combineLatest } from 'rxjs';
import { ITEMS_PER_PAGE } from '../../../shared/constants/pagination.constants';
import { NotafiscalService } from '../../../services/notafiscal.service';
import { ActivatedRoute, Router, Data, ParamMap } from '@angular/router';
import { JhiEventManager, JhiEventWithContent, JhiAlertService } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { IParceiro } from '../../../model/parceiro.model';
import { ParceiroService } from '../../../services/parceiro.service';
import { NfeUploadComponent } from './nfe-upload.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MesAnoDTO } from '../../../shared/dto/mesAnoDTO';
import { MESES, MESLABELS } from '../../../shared/constants/input.constants';
import * as moment from 'moment';
import { UploadService } from '../../../services/file-upload.service';
import { SERVER_API_URL } from '../../../app.constants';
import { Moment } from 'moment';

@Component({
  selector: 'jhi-nfe',
  templateUrl: './nfe.component.html',
  styleUrls: ['./nfe.component.scss'],
})
export class NfeComponent implements OnInit, OnDestroy {
  parceiroListener!: Subscription;
  notafiscals?: INotafiscal[];
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  parceiro!: IParceiro;
  periodo = '';
  resourceUrl = SERVER_API_URL + 'api/downloadFile/notafiscal/';

  constructor(
    protected notafiscalService: NotafiscalService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    private parceiroService: ParceiroService,
    public spinner: NgxSpinnerService,
    public fileService: UploadService,
    private alertService: JhiAlertService
  ) {
    this.registerParceiroListener();
    this.registerChangeInNotafiscals();
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    const pageToLoad: number = page || this.page || 1;
    this.spinner.show();
    const queryParam = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      sort: this.sort(),
      'parceiroId.equals': this.parceiro.id,
    };
    if (this.periodo !== '') {
      queryParam['periodo.equals'] = this.periodo;
    }
    this.notafiscalService.query(queryParam).subscribe(
      (res: HttpResponse<INotafiscal[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
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

  trackId(index: number, item: INotafiscal): number {
    return item.id!;
  }

  registerChangeInNotafiscals(): void {
    this.eventSubscriber = this.eventManager.subscribe('fileUpload', (response: JhiEventWithContent<string>) => {
      this.alertService.success('mrcontadorFrontApp.notafiscal.uploaded');
      this.loadPage();
    });
  }

  upload(): void {
    const modalRef = this.modalService.open(NfeUploadComponent, { size: 'xl', backdrop: 'static', scrollable: true });
    modalRef.componentInstance.parceiroId = this.parceiro.id;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: INotafiscal[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/onboard/nfe'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }

    this.notafiscals = data || [];
    this.periodo = this.notafiscals.length > 0 ? this.notafiscals[0].periodo || '' : '';
    this.ngbPaginationPage = this.page;
    this.spinner.hide();
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
    this.spinner.hide();
  }
  onChangeAgencia(): void {
    this.page = 0;
    this.loadPage(this.page, true);
  }

  public selectPeriodo(value: string): void {
    this.periodo = value;
    this.loadPage(this.page, true);
  }

  private registerParceiroListener(): void {
    this.parceiroListener = this.eventManager.subscribe('parceiroSelected', (response: JhiEventWithContent<IParceiro>) => {
      this.parceiro = response.content;
      if (this.parceiro?.agenciabancarias) {
        this.onChangeAgencia();
      }
    });
  }

  public download(nfe: INotafiscal): void {
    this.fileService.downloadFile(this.resourceUrl + nfe.id).subscribe(
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
