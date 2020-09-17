import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { INotafiscal } from 'app/shared/model/notafiscal.model';
import { NotafiscalService } from './notafiscal.service';

@Component({
  templateUrl: './notafiscal-delete-dialog.component.html',
})
export class NotafiscalDeleteDialogComponent {
  notafiscal?: INotafiscal;

  constructor(
    protected notafiscalService: NotafiscalService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.notafiscalService.delete(id).subscribe(() => {
      this.eventManager.broadcast('notafiscalListModification');
      this.activeModal.close();
    });
  }
}
