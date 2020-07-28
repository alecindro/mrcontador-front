import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Parceiro, IParceiro } from 'app/shared/model/parceiro.model';
import { MesAnoDTO } from 'app/shared/dto/mesAnoDTO';
import { JhiEventManager, JhiEventWithContent } from 'ng-jhipster';
import { ParceiroService } from 'app/entities/parceiro/parceiro.service';
import { ContaService } from 'app/entities/conta/conta.service';
import { IConta } from 'app/shared/model/conta.model';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-dash-conta',
  templateUrl: './contadash.component.html',
  styleUrls: ['./contadash.component.scss'],
})
export class ContaDashComponent implements OnInit, OnDestroy {
  parceiroListener!: Subscription;
  mesAnoListener!: Subscription;
  mesAno!: MesAnoDTO;
  contas?: IConta[];
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  parceiro?: IParceiro;

  constructor(
    private eventManager: JhiEventManager,
    private parceiroService: ParceiroService,
    private contaService: ContaService,
    public spinner: NgxSpinnerService,
    protected router: Router
  ) {
    this.parceiroListener = eventManager.subscribe('parceiroSelected', (response: JhiEventWithContent<Parceiro>) => {
      this.parceiro = response.content;
      this.loadPage();
    });
    this.mesAnoListener = eventManager.subscribe('mesAnoSelected', (response: JhiEventWithContent<MesAnoDTO>) => {
      this.mesAno = response.content;
    });
  }

  ngOnInit(): void {
    this.parceiro = this.parceiroService.getParceiroSelected();
    this.loadPage();
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
    this.contaService.query(queryParam).subscribe(
      (res: HttpResponse<IConta[]>) => this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate),
      () => this.onError()
    );
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== ' con_conta') {
      result.push(' con_conta');
    }
    return result;
  }

  protected onSuccess(data: IConta[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/conta'], {
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

  onError(): void {
    this.spinner.hide();
  }

  ngOnDestroy(): void {
    if (this.parceiroListener) {
      this.eventManager.destroy(this.parceiroListener);
    }
    if (this.mesAnoListener) {
      this.eventManager.destroy(this.mesAnoListener);
    }
  }
}
