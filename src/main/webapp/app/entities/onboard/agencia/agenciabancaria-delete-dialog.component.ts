import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IAgenciabancaria } from '../../../model/agenciabancaria.model';
import { AgenciabancariaService } from '../../../services/agenciabancaria.service';

@Component({
  templateUrl: './agenciabancaria-delete-dialog.component.html',
})
export class AgenciabancariaDeleteDialogComponent {
  agenciabancaria?: IAgenciabancaria;

  constructor(
    protected agenciabancariaService: AgenciabancariaService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.agenciabancariaService.delete(id).subscribe(() => {
      this.eventManager.broadcast('agenciabancariaListModification');
      this.activeModal.close();
    });
  }
}
