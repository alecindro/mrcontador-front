import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { IInteligent } from '../../../model/inteligent.model';
import { InteligentService } from '../../../services/inteligent.service';

@Component({
  templateUrl: './nf-delete.component.html',
})
export class NfDeleteComponent {
  inteligent: IInteligent = {};
  constructor(public activeModal: NgbActiveModal, protected eventManager: JhiEventManager, private inteligentService: InteligentService) {}

  public confirmDelete(): void {
    this.inteligentService.removeNf(this.inteligent).subscribe(
      sucess => {
        this.eventManager.broadcast('nfassociate');
        this.activeModal.close();
      },
      err => {
        console.log(err);
      }
    );
  }

  public cancel(): void {
    this.activeModal.close();
  }
}
