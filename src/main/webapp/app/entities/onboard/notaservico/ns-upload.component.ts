import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { IParceiro } from 'app/model/parceiro.model';
import { UploadService } from 'app/services/file-upload.service ';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ParceiroService } from 'app/services/parceiro.service';

@Component({
  templateUrl: './ns-dialog.component.html',
})
export class NsUploadComponent implements OnInit {
  parceiro?: IParceiro;
  progressInfos: { value: number; fileName: string; file: any; index: number; _event: any }[] = [];
  message = '';

  error: any = {};
  uploadResponse = { status: '', message: '', percent: 0, filePath: '' };

  constructor(
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager,
    private uploadService: UploadService,
    private parceiroService: ParceiroService
  ) {}

  ngOnInit(): void {
    this.parceiro = this.parceiroService.getParceiroSelected();
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  selectFiles(event: any): void {
    event.preventDefault();
    this.progressInfos = [];
    for (let i = 0; i < event.target.files.length; i++) {
      this.progressInfos[i] = { value: 0, fileName: event.target.files[i].name, file: event.target.files[i], index: i, _event: event };
    }
  }

  uploadFiles(): void {
    this.message = '';
    for (let i = 0; i < this.progressInfos.length; i++) {
      this.upload(i, this.progressInfos[i]);
    }
  }
  upload(idx: number, progressInfo: any): void {
    if (progressInfo.file) {
      const queryParam: any = {
        idParceiro: this.parceiro?.id,
      };
      this.uploadService.uploadFiles(progressInfo.file, this.uploadService.nsUrl, queryParam).subscribe(
        event => {
          if (event && event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round((100 * event.loaded) / event.total);
            this.progressInfos[idx].file = undefined;
          } else if (event instanceof HttpResponse) {
            this.message = event.status.toString();
          }
        },
        err => {
          this.progressInfos[idx].value = 0;
          this.message = 'Não foi possivel carregar o arquivo:' + err;
        }
      );
    }
  }
  remove(progressInfo: any): void {
    this.progressInfos = this.progressInfos.filter(t1 => {
      if (t1.index === progressInfo.index) {
        return false;
      }
      return true;
    });
  }

  allowDrop(ev: any): void {
    ev.preventDefault();
  }

  drop(ev: any): void {
    ev.preventDefault();
    ev.target.files = ev.dataTransfer.files;
    this.selectFiles(ev);
  }
}
