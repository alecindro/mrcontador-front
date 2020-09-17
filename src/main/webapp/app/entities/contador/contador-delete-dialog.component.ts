import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IContador } from 'app/shared/model/contador.model';
import { ContadorService } from './contador.service';

@Component({
  templateUrl: './contador-delete-dialog.component.html',
})
export class ContadorDeleteDialogComponent {
  contador?: IContador;

  constructor(protected contadorService: ContadorService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.contadorService.delete(id).subscribe(() => {
      this.eventManager.broadcast('contadorListModification');
      this.activeModal.close();
    });
  }
}
