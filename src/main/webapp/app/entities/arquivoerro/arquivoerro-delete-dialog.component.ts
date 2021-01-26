import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IArquivoerro } from 'app/model/arquivoerro.model';
import { ArquivoerroService } from './arquivoerro.service';

@Component({
  templateUrl: './arquivoerro-delete-dialog.component.html',
})
export class ArquivoerroDeleteDialogComponent {
  arquivoerro?: IArquivoerro;

  constructor(
    protected arquivoerroService: ArquivoerroService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.arquivoerroService.delete(id).subscribe(() => {
      this.eventManager.broadcast('arquivoerroListModification');
      this.activeModal.close();
    });
  }
}
