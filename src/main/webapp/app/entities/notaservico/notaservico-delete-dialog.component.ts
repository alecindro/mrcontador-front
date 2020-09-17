import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { INotaservico } from 'app/shared/model/notaservico.model';
import { NotaservicoService } from './notaservico.service';

@Component({
  templateUrl: './notaservico-delete-dialog.component.html',
})
export class NotaservicoDeleteDialogComponent {
  notaservico?: INotaservico;

  constructor(
    protected notaservicoService: NotaservicoService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.notaservicoService.delete(id).subscribe(() => {
      this.eventManager.broadcast('notaservicoListModification');
      this.activeModal.close();
    });
  }
}
