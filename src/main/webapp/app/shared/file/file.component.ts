import { FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { UploadService } from 'app/services/file-upload.service ';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-app-file',
  templateUrl: './file.component.html',
  styleUrls: ['filecomponent.scss'],
})
export class FileComponent {
  progressInfos: { value: number; fileName: string; file: any; index: number }[] = [];
  message = '';

  error: any = {};
  uploadResponse = { status: '', message: '', percent: 0, filePath: '' };

  constructor(private formBuilder: FormBuilder, private uploadService: UploadService) {}

  selectFiles(event: any): void {
    event.preventDefault();
    this.progressInfos = [];
    for (let i = 0; i < event.target.files.length; i++) {
      this.progressInfos[i] = { value: 0, fileName: event.target.files[i].name, file: event.target.files[i], index: i };
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
      this.uploadService.uploadFiles(progressInfo.file, this.uploadService.planocontasUrl).subscribe(
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

  allowDrop(ev: any): void {
    ev.preventDefault();
  }

  drop(ev: any): void {
    ev.preventDefault();
    ev.target.files = ev.dataTransfer.files;
    this.selectFiles(ev);
  }

  remove(progressInfo: any): void {
    this.progressInfos = this.progressInfos.filter(t1 => t1.fileName !== progressInfo.fileName || t1.index !== progressInfo.index);
  }
}
