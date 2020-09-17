import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IParceiro } from 'app/shared/model/parceiro.model';
import { ParceiroService } from './parceiro.service';

@Component({
  templateUrl: './parceiro-delete-dialog.component.html',
})
export class ParceiroDeleteDialogComponent {
  parceiro?: IParceiro;

  constructor(protected parceiroService: ParceiroService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.parceiroService.delete(id).subscribe(() => {
      this.eventManager.broadcast('parceiroListModification');
      this.activeModal.close();
    });
  }
}
