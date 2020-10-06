import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { RegraService } from 'app/services/regra.service';
import { IRegra } from 'app/model/regra.model';

@Component({
  templateUrl: './regra-delete-dialog.component.html',
})
export class RegraDeleteDialogComponent {
  regra?: IRegra;

  constructor(protected regraService: RegraService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.regraService.delete(id).subscribe(() => {
      this.eventManager.broadcast('regraUpdate');
      this.activeModal.close();
    });
  }
}
