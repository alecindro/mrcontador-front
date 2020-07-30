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
  mesAnoListener!: Subscription;
  parceiro!: Parceiro;
  mesAno!: MesAnoDTO;
  constructor(private eventManager: JhiEventManager) {
    this.mesAnoListener = eventManager.subscribe('mesAnoSelected', (response: JhiEventWithContent<MesAnoDTO>) => {
      this.mesAno = response.content;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.mesAnoListener) {
      this.eventManager.destroy(this.mesAnoListener);
    }
  }
}
