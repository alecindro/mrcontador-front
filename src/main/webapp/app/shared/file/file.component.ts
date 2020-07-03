import { FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { UploadService } from './file-upload.service ';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-app-file',
  templateUrl: './file.component.html',
  styleUrls: ['filecomponent.scss'],
})
export class FileComponent {
  selectedFiles!: FileList;
  progressInfos = [{ value: 0, fileName: '' }];
  message = '';

  form = this.formBuilder.group({
    avatar: [''],
  });
  error: any = {};
  uploadResponse = { status: '', message: '', percent: 0, filePath: '' };

  constructor(private formBuilder: FormBuilder, private uploadService: UploadService) {}

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get(['avatar'])!.setValue(file);
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('file', this.form.get(['avatar'])!.value);
    this.uploadService.upload(formData).subscribe(
      (res: any) => (this.uploadResponse = res),
      (err: any) => (this.error = err)
    );
  }

  selectFiles(event: any): void {
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
  }

  uploadFiles(): void {
    this.message = '';
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.upload(i, this.selectedFiles[i]);
    }
  }
  upload(idx: number, file: any): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };

    this.uploadService.uploadFiles(file).subscribe(
      event => {
        if (event && event.type === HttpEventType.UploadProgress) {
          this.progressInfos[idx].value = Math.round((100 * event.loaded) / event.total);
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
