import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiEventWithContent } from 'ng-jhipster';
import { UploadService } from '../../../services/file-upload.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './nfe-dialog.component.html',
})
export class NfeUploadComponent implements OnInit, OnDestroy {
  parceiroId = 0;
  urlUpload = '';
  eventSubscriber?: Subscription;
  closeEventSubscriber?: Subscription;

  constructor(public activeModal: NgbActiveModal, protected eventManager: JhiEventManager, private uploadService: UploadService) {
    this.urlUpload = this.uploadService.nfUrl;
  }

  ngOnInit(): void {
    this.registerChangeInNotafiscals();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
    if (this.closeEventSubscriber) {
      this.eventManager.destroy(this.closeEventSubscriber);
    }
  }

  registerChangeInNotafiscals(): void {
    this.eventSubscriber = this.eventManager.subscribe('fileUpload', (response: JhiEventWithContent<string>) => {
      this.activeModal.close();
    });
    this.closeEventSubscriber = this.eventManager.subscribe('fileUploadClose', () => {
      this.activeModal.dismiss();
    });
  }
}
