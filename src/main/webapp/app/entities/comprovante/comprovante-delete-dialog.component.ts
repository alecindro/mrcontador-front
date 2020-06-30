import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IComprovante } from 'app/shared/model/comprovante.model';
import { ComprovanteService } from './comprovante.service';

@Component({
  templateUrl: './comprovante-delete-dialog.component.html',
})
export class ComprovanteDeleteDialogComponent {
  comprovante?: IComprovante;

  constructor(
    protected comprovanteService: ComprovanteService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.comprovanteService.delete(id).subscribe(() => {
      this.eventManager.broadcast('comprovanteListModification');
      this.activeModal.close();
    });
  }
}
