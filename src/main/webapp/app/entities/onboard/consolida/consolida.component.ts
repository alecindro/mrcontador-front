import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiEventWithContent } from 'ng-jhipster';
import { Parceiro } from 'app/shared/model/parceiro.model';
import { MesAnoDTO } from 'app/shared/dto/mesAnoDTO';

@Component({
  selector: 'jhi-consolida',
  templateUrl: './consolida.component.html',
  styleUrls: ['./consolida.component.scss'],
})
export class ConsolidaComponent implements OnInit, OnDestroy {
  parceiroListener!: Subscription;
  mesAnoListener!: Subscription;
  parceiro!: Parceiro;
  mesAno!: MesAnoDTO;
  constructor(private eventManager: JhiEventManager) {
    this.parceiroListener = eventManager.subscribe('parceiroSelected', (response: JhiEventWithContent<Parceiro>) => {
      this.parceiro = response.content;
    });
    this.mesAnoListener = eventManager.subscribe('mesAnoSelected', (response: JhiEventWithContent<MesAnoDTO>) => {
      this.mesAno = response.content;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.parceiroListener) {
      this.eventManager.destroy(this.parceiroListener);
    }
    if (this.mesAnoListener) {
      this.eventManager.destroy(this.mesAnoListener);
    }
  }
}
