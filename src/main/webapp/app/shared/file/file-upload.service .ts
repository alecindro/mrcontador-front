import { Injectable } from '@angular/core';
import { SERVER_API_URL } from 'app/app.constants';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { createRequestOption } from 'app/shared/util/request-util';
import { Observable } from 'rxjs';

type EntityResponseType = HttpResponse<any>;
@Injectable({
  providedIn: 'root',
})
export class UploadService {
  public planocontasUrl = SERVER_API_URL + 'api/upload/planoconta';
  public comprovanteUrl = SERVER_API_URL + 'api/upload/comprovante';
  public extratoUrl = SERVER_API_URL + 'api/upload/extrato';
  public nfUrl = SERVER_API_URL + 'api/upload/nf';
  public nsUrl = SERVER_API_URL + 'api/upload/ns';

  constructor(private http: HttpClient) {}

  public upload(file: File, url: any, req?: any): any {
    const options = createRequestOption(req);
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http
      .post<any>(url, formData, {
        params: options,
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

  public uploadFiles(file: File, url: any, req?: any): Observable<any> {
    const options = createRequestOption(req);
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(url, formData, { params: options, reportProgress: true, observe: 'events' });
  }

  public downloadFile(url: any): Observable<any> {
    return this.http.get(url, { responseType: 'blob' });
  }
}
