import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ParceiroService } from '../../../services/parceiro.service';
import { IParceiro } from '../../../model/parceiro.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  templateUrl: './caddash-dialog.component.html',
})
export class CadDashDialogComponent {
  parceiro: IParceiro = {};

  constructor(
    protected parceiroService: ParceiroService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager,
    private spinner: NgxSpinnerService
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmUpdate(): void {
    this.spinner.show();
    this.parceiroService.update(this.parceiro).subscribe(
      () => {
        this.eventManager.broadcast('parceiroSelected');
        this.spinner.hide();
        this.activeModal.close();
      },
      () => this.spinner.hide()
    );
  }
}
