import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';

import { SERVER_API_URL } from 'app/app.constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private localStorage: LocalStorageService, private sessionStorage: SessionStorageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request || !request.url || (request.url.startsWith('http') && !(SERVER_API_URL && request.url.startsWith(SERVER_API_URL)))) {
      return next.handle(request);
    }

    const token = this.localStorage.retrieve('authenticationToken') || this.sessionStorage.retrieve('authenticationToken');
    const tenant = this.localStorage.retrieve('tenant_uuid') || this.sessionStorage.retrieve('tenant_uuid');
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
      'tenant-uuid': tenant,
    });
    if (request.url.includes('api/upload')) {
      headers = headers.append('timeout', '300000');
    }
    if (token) {
      request = request.clone({ headers });
    }
    return next.handle(request);
  }
}
