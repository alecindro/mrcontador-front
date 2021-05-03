import { Component, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UploadService } from '../../services/file-upload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { JhiEventManager, JhiEventWithContent } from 'ng-jhipster';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-upload',
  templateUrl: './upload.component.html',
})
export class UploadComponent {
  @Input()
  parceiroId = 0;
  @Input()
  urlUpload = '';
  @Input()
  agenciaId = 0;
  @Input()
  title = '';

  totalUpload = 0;

  constructor(
    private spinner: NgxSpinnerService,
    private uploadService: UploadService,
    private eventManager: JhiEventManager,
    public translate: TranslateService
  ) {}

  progressInfos: { value: number; fileName: string; file: any; index: number; _event: any; message?: string; error?: boolean }[] = [];
  uploadResponse = { status: '', message: '', percent: 0, filePath: '' };

  allowDrop(ev: any): void {
    ev.preventDefault();
  }

  drop(ev: any): void {
    ev.preventDefault();
    ev.target.files = ev.dataTransfer.files;
    this.selectFiles(ev);
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
    if (progressInfo.file) {
      const queryParam: any = {
        idParceiro: this.parceiroId,
      };
      if (this.agenciaId > 0) {
        queryParam['idAgenciabancaria'] = this.agenciaId;
      }
      const size = this.progressInfos.length;
      this.uploadService.uploadFiles(progressInfo.file, this.urlUpload, queryParam).subscribe(
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
              if (this.progressInfos.length === 0) {
                this.eventManager.broadcast(new JhiEventWithContent('fileUpload', event.body + ''));
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

  public cancelar(): void {
    this.eventManager.broadcast(new JhiEventWithContent('fileUploadClose', ''));
  }
}
