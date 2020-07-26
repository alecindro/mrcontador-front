import { Injectable } from '@angular/core';
import { SERVER_API_URL } from 'app/app.constants';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

type EntityResponseType = HttpResponse<any>;
@Injectable({
  providedIn: 'root',
})
export class UploadService {
  public resourceUrl = SERVER_API_URL + 'api/upload/planoconta';
  constructor(private http: HttpClient) {}

  public upload(file: File): any {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http
      .post<any>(this.resourceUrl, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map(event => {
          switch (event.type) {
            case HttpEventType.UploadProgress: {
              const total = event.total ? event.total : 1;
              const progress = Math.round((100 * event.loaded) / total);
              return { status: 'progress', percent: progress };
            }
            case HttpEventType.Response:
              return event.body;
            default:
              return `Unhandled event: ${event.type}`;
          }
        })
      );
  }

  public uploadFiles(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(this.resourceUrl, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }
}
