import { Component, OnInit, OnDestroy } from '@angular/core';
import { ParceiroService } from '../parceiro/parceiro.service';
import { IParceiro } from 'app/shared/model/parceiro.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MESLABELS, MESES } from 'app/shared/constants/input.constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { JhiEventManager, JhiEventWithContent } from 'ng-jhipster';
import { MesAnoDTO } from 'app/shared/dto/mesAnoDTO';
import { Subscription } from 'rxjs';
import { AgenciabancariaService } from '../agenciabancaria/agenciabancaria.service';
import { IAgenciabancaria } from 'app/shared/model/agenciabancaria.model';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.scss'],
})
export class OnboardComponent implements OnInit, OnDestroy {
  readonly meses = MESES;
  readonly mesLabels = MESLABELS;
  anos: number[] = [];
  anoSelected?: number;
  mesSelected?: number;
  parceiro!: IParceiro;
  parceiros!: IParceiro[];
  agenciaListener!: Subscription;
  hasAgencia = false;
  constructor(
    public parceiroService: ParceiroService,
    public activatedRoute: ActivatedRoute,
    public spinner: NgxSpinnerService,
    public eventManager: JhiEventManager,
    protected router: Router,
    protected agenciabancariaService: AgenciabancariaService
  ) {
    this.agenciaListener = eventManager.subscribe('agenciasaved', () => {
      this.loadAgencias(this.parceiro);
    });
  }

  ngOnInit(): void {
    this.initDate();
    this.spinner.show();
    this.activatedRoute.data.subscribe(({ parceiro }) => {
      this.parceiro = parceiro;
      this.parceiroService.setParceiroSelected(parceiro);
      this.loadAgencias(parceiro);
      this.parceiroService.get().subscribe(response => {
        this.parceiros = response.body || [parceiro];
        this.spinner.hide();
      });
    });
  }

  private loadParceiro(parceiro: IParceiro): void {
    this.parceiro = parceiro;
    if (this.parceiro.agenciabancarias) {
      const value = this.parceiro.agenciabancarias.find(agencia => {
        return agencia.ageSituacao === true;
      });
      this.hasAgencia = value?.ageSituacao || false;
    } else {
      this.hasAgencia = false;
    }
    this.parceiroService.setParceiroSelected(parceiro);
    this.eventManager.broadcast(new JhiEventWithContent('parceiroSelected', parceiro));
  }

  ngOnDestroy(): void {
    this.eventManager.destroy(this.agenciaListener);
  }
  onChangeParceiro(parceiro: IParceiro): void {
    this.loadParceiro(parceiro);
    this.router.navigate([`/onboard/${this.parceiro.id}`]);
  }
  compareFn(val1: IParceiro, val2: IParceiro): boolean {
    return val1 && val2 ? val1.id === val2.id : val1 === val2;
  }

  onChangeMes(): void {
    const mesAno = new MesAnoDTO(this.mesSelected, this.anoSelected);
    this.eventManager.broadcast(new JhiEventWithContent('mesAnoSelected', mesAno));
  }
  onChangeAno(): void {
    this.onChangeMes();
  }

  private initDate(): void {
    const data = new Date();
    for (let i = 0; i < 5; i++) {
      this.anos.push(data.getFullYear() - i);
    }
    this.anoSelected = this.anos[0];
    this.mesSelected = this.meses[data.getMonth()];
    this.onChangeMes();
  }

  private loadAgencias(parceiro: IParceiro): void {
    const queryParam = {
      'parceiroId.equals': parceiro.id,
    };
    this.agenciabancariaService.query(queryParam).subscribe((res: HttpResponse<IAgenciabancaria[]>) => {
      parceiro.agenciabancarias = res.body || [];
      this.loadParceiro(parceiro);
    });
  }
}
