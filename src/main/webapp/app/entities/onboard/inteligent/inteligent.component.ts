import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiEventWithContent } from 'ng-jhipster';
import { MesAnoDTO } from 'app/shared/dto/mesAnoDTO';
import { IInteligent } from 'app/shared/model/inteligent.model';
import { MESES, MESLABELS } from 'app/shared/constants/input.constants';
import { InteligentService } from 'app/entities/inteligent/inteligent.service';
import { ParceiroService } from 'app/entities/parceiro/parceiro.service';
import { IParceiro } from 'app/shared/model/parceiro.model';
import { IAgenciabancaria } from 'app/shared/model/agenciabancaria.model';
import { HttpResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { IRegra, Regra } from 'app/shared/model/regra.model';

@Component({
  selector: 'jhi-inteligent',
  templateUrl: './inteligent.component.html',
  styleUrls: ['./inteligent.component.scss'],
})
export class InteligentComponent implements OnInit, OnDestroy {
  parceiroListener!: Subscription;
  divergencias?: IInteligent[] = [];
  conciliados?: IInteligent[] = [];
  regra?: IRegra;
  mesAno!: MesAnoDTO;
  readonly meses = MESES;
  readonly mesLabels = MESLABELS;
  anos: number[] = [];
  anoSelected?: number;
  mesSelected?: number;
  parceiro?: IParceiro;
  agenciaSelected?: IAgenciabancaria;

  constructor(
    private eventManager: JhiEventManager,
    protected inteligentService: InteligentService,
    protected parceiroService: ParceiroService,
    public spinner: NgxSpinnerService,
    public activatedRoute: ActivatedRoute
  ) {
    this.registerParceiroListener();
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parceiro }) => {
      this.parceiro = parceiro;
      if (!parceiro) {
        this.parceiro = this.parceiroService.getParceiroSelected();
      }
      this.initDate();
      if (this.parceiro?.agenciabancarias) {
        this.agenciaSelected = this.parceiro?.agenciabancarias[0];
        this.loadDivergencias();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.parceiroListener) {
      this.eventManager.destroy(this.parceiroListener);
    }
  }

  public processConsolidacao(): void {
    const queryParam = {
      parceiroId: this.parceiro?.id,
      periodo: this.mesSelected + '' + this.anoSelected,
      agenciabancariaId: this.agenciaSelected?.id,
    };
    this.spinner.show();
    this.inteligentService.queryFuntion(queryParam).subscribe(
      res => {
        this.spinner.hide();
        console.log(res);
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  private loadDivergencias(): void {
    const queryParam = {
      'parceiroId.equals': this.parceiro?.id,
      'periodo.equals': this.mesSelected + '' + this.anoSelected,
      'associado.equals': false,
      sort: ['datalancamento,asc'],
    };
    if (this.agenciaSelected) {
      queryParam['agenciabancariaId.equals'] = this.agenciaSelected?.id;
    }
    this.spinner.show();
    this.inteligentService.query(queryParam).subscribe(
      (res: HttpResponse<IInteligent[]>) => {
        this.divergencias = res.body || [];
        this.loadConciliados();
      },
      (err: any) => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  private loadConciliados(): void {
    const queryParam = {
      'parceiroId.equals': this.parceiro?.id,
      'periodo.equals': this.mesSelected + '' + this.anoSelected,
      'associado.equals': true,
      sort: ['datalancamento,asc'],
    };
    if (this.agenciaSelected) {
      queryParam['agenciabancariaId.equals'] = this.agenciaSelected?.id;
    }
    this.inteligentService.query(queryParam).subscribe(
      (res: HttpResponse<IInteligent[]>) => {
        this.conciliados = res.body || [];
        this.spinner.hide();
      },
      (err: any) => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  onChangeAgencia(): void {
    this.loadDivergencias();
  }

  onChangeMes(): void {
    this.loadDivergencias();
  }
  onChangeAno(): void {
    this.loadDivergencias();
  }
  private initDate(): void {
    const data = new Date();
    for (let i = 0; i < 5; i++) {
      this.anos.push(data.getFullYear() - i);
    }
    this.anoSelected = this.anos[0];
    this.mesSelected = this.meses[data.getMonth()];
  }

  private registerParceiroListener(): void {
    this.parceiroListener = this.eventManager.subscribe('parceiroSelected', (response: JhiEventWithContent<IParceiro>) => {
      this.parceiro = response.content;
      this.initDate();
      if (this.parceiro?.agenciabancarias) {
        this.agenciaSelected = this.parceiro?.agenciabancarias[0];
        this.loadDivergencias();
      }
    });
  }

  selectInteligent(inteligent: IInteligent): void {
    this.regra = new Regra();
    this.regra.regDescricao = inteligent.historico;
    this.regra.regHistorico = '';
  }
}
