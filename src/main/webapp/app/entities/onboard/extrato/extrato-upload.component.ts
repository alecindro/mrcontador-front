import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { IAgenciabancaria } from 'app/model/agenciabancaria.model';
import { IParceiro } from 'app/model/parceiro.model';
import { UploadService } from 'app/shared/file/file-upload.service ';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ParceiroService } from 'app/services/parceiro.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: './extrato-dialog.component.html',
})
export class ExtratoUploadComponent implements OnInit {
  agenciaSelected?: IAgenciabancaria;
  agencias?: IAgenciabancaria[];
  parceiro?: IParceiro;
  progressInfos: { value: number; fileName: string; file: any; index: number; _event: any; message?: string; error?: boolean }[] = [];
  totalUpload = 0;

  error: any = {};
  uploadResponse = { status: '', message: '', percent: 0, filePath: '' };

  constructor(
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager,
    private uploadService: UploadService,
    private parceiroService: ParceiroService,
    public spinner: NgxSpinnerService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.parceiro = this.parceiroService.getParceiroSelected();
    this.agencias = this.parceiro.agenciabancarias?.filter(agencia => {
      return agencia.ageSituacao === true;
    });
    if (this.agencias && this.agencias.length > 0) {
      this.agenciaSelected = this.agencias[0];
    }
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
    this.spinner.show();
    for (let i = 0; i < this.progressInfos.length; i++) {
      this.upload(i, this.progressInfos[i]);
    }
  }
  upload(idx: number, progressInfo: any): void {
    const queryParam: any = {
      idParceiro: this.parceiro?.id,
      idAgenciabancaria: this.agenciaSelected?.id,
    };
    if (progressInfo.file) {
      const size = this.progressInfos.length;
      this.spinner.show();
      this.uploadService.uploadFiles(progressInfo.file, this.uploadService.extratoUrl, queryParam).subscribe(
        event => {
          if (event && event.type === HttpEventType.UploadProgress) {
            progressInfo.value = Math.round((100 * event.loaded) / event.total);
          } else if (event instanceof HttpResponse) {
            const index = this.progressInfos.indexOf(progressInfo);
            this.progressInfos.splice(index, 1);
            this.totalUpload = this.totalUpload + 1;
            if (size === this.totalUpload) {
              this.spinner.hide();
              this.totalUpload = 0;
              this.eventManager.broadcast('extratoUpload');
              if (this.progressInfos.length === 0) {
                this.activeModal.close();
              }
            }
          }
        },
        err => {
          this.totalUpload = this.totalUpload + 1;
          progressInfo.message = this.translate.instant(err.error.message);
          progressInfo.error = true;
          if (size === this.totalUpload) {
            this.spinner.hide();
            this.totalUpload = 0;
            this.eventManager.broadcast('extratoUpload');
          }
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
