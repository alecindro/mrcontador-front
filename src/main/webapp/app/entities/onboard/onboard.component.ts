import { Component, OnInit } from '@angular/core';
import { ParceiroService } from '../parceiro/parceiro.service';
import { IParceiro } from 'app/shared/model/parceiro.model';
import { ActivatedRoute } from '@angular/router';
import { MESLABELS, MESES } from 'app/shared/constants/input.constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { JhiEventManager, JhiEventWithContent } from 'ng-jhipster';
import { MesAnoDTO } from 'app/shared/dto/mesAnoDTO';

@Component({
  selector: 'jhi-onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.scss'],
})
export class OnboardComponent implements OnInit {
  readonly meses = MESES;
  readonly mesLabels = MESLABELS;
  anos: number[] = [];
  anoSelected?: number;
  mesSelected?: number;
  parceiro!: IParceiro;
  parceiros!: IParceiro[];
  constructor(
    public parceiroService: ParceiroService,
    public activatedRoute: ActivatedRoute,
    public spinner: NgxSpinnerService,
    public eventManager: JhiEventManager
  ) {}

  ngOnInit(): void {
    this.initDate();
    this.spinner.show();
    this.activatedRoute.data.subscribe(({ parceiro }) => {
      this.onChangeParceiro(parceiro);
      this.parceiroService.query().subscribe(response => {
        this.parceiros = response.body || [parceiro];
        this.spinner.hide();
      });
    });
  }
  onChangeParceiro(parceiro: IParceiro): void {
    this.parceiro = parceiro;
    this.parceiroService.setParceiroSelected(parceiro);
    this.eventManager.broadcast(new JhiEventWithContent('parceiroSelected', parceiro));
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
}
