import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { IAgenciabancaria } from 'app/shared/model/agenciabancaria.model';
import { IParceiro } from 'app/shared/model/parceiro.model';
import { UploadService } from 'app/shared/file/file-upload.service ';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ParceiroService } from 'app/entities/parceiro/parceiro.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  templateUrl: './extrato-dialog.component.html',
})
export class ExtratoUploadComponent implements OnInit {
  agenciaSelected?: IAgenciabancaria;
  agencias?: IAgenciabancaria[];
  parceiro?: IParceiro;
  progressInfos: { value: number; fileName: string; file: any; index: number; _event: any }[] = [];
  message = '';

  error: any = {};
  uploadResponse = { status: '', message: '', percent: 0, filePath: '' };

  constructor(
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager,
    private uploadService: UploadService,
    private parceiroService: ParceiroService,
    public spinner: NgxSpinnerService
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

  uploadTest(): void {
    console.log(this.agenciaSelected);
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
    const queryParam: any = {
      idParceiro: this.parceiro?.id,
      idAgenciabancaria: this.agenciaSelected?.id,
    };
    if (progressInfo.file) {
      this.spinner.show();
      this.uploadService.uploadFiles(progressInfo.file, this.uploadService.extratoUrl, queryParam).subscribe(
        event => {
          if (event && event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round((100 * event.loaded) / event.total);
          } else if (event instanceof HttpResponse) {
            this.progressInfos.splice(idx, 1);
            this.message = event.status.toString();
            if (this.progressInfos.length === 0) {
              this.spinner.hide();
              this.activeModal.close();
              this.eventManager.broadcast('extratoUpload');
            }
          }
        },
        err => {
          this.message = 'Não foi possivel carregar o arquivo:' + err;
          this.spinner.hide();
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
