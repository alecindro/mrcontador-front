import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IArquivoerro } from 'app/model/arquivoerro.model';
import { ArquivoerroService } from './arquivoerro.service';

@Component({
  templateUrl: './arquivoerro-process-dialog.component.html',
})
export class ArquivoerroProcessDialogComponent {
  arquivoerro!: IArquivoerro;

  constructor(
    protected arquivoerroService: ArquivoerroService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmProcess(): void {
    this.arquivoerroService.create(this.arquivoerro).subscribe(() => {
      this.eventManager.broadcast('arquivoerroListModification');
      this.activeModal.close();
    });
  }
}
