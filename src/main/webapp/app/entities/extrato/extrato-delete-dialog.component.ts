import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IExtrato } from 'app/shared/model/extrato.model';
import { ExtratoService } from './extrato.service';

@Component({
  templateUrl: './extrato-delete-dialog.component.html',
})
export class ExtratoDeleteDialogComponent {
  extrato?: IExtrato;

  constructor(protected extratoService: ExtratoService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.extratoService.delete(id).subscribe(() => {
      this.eventManager.broadcast('extratoListModification');
      this.activeModal.close();
    });
  }
}
