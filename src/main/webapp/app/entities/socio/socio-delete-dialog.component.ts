import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ISocio } from 'app/model/socio.model';
import { SocioService } from '../../services/socio.service';

@Component({
  templateUrl: './socio-delete-dialog.component.html',
})
export class SocioDeleteDialogComponent {
  socio?: ISocio;

  constructor(protected socioService: SocioService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.socioService.delete(id).subscribe(() => {
      this.eventManager.broadcast('socioListModification');
      this.activeModal.close();
    });
  }
}
