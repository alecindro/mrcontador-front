import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IConta } from 'app/shared/model/conta.model';
import { ContaService } from './conta.service';

@Component({
  templateUrl: './conta-delete-dialog.component.html',
})
export class ContaDeleteDialogComponent {
  conta?: IConta;

  constructor(protected contaService: ContaService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.contaService.delete(id).subscribe(() => {
      this.eventManager.broadcast('contaListModification');
      this.activeModal.close();
    });
  }
}
