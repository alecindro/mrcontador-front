import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

import { SERVER_API_URL } from 'app/app.constants';
import { Login } from 'app/core/login/login.model';

type JwtToken = {
  id_token: string;
  tenant_uuid: string;
  sistema: string;
};

@Injectable({ providedIn: 'root' })
export class AuthServerProvider {
  constructor(private http: HttpClient, private $localStorage: LocalStorageService, private $sessionStorage: SessionStorageService) {}

  getToken(): string {
    return this.$localStorage.retrieve('authenticationToken') || this.$sessionStorage.retrieve('authenticationToken') || '';
  }

  getTenant(): string {
    return this.$localStorage.retrieve('tenant_uuid') || this.$sessionStorage.retrieve('tenant_uuid') || '';
  }

  getSistema(): string {
    return this.$localStorage.retrieve('sistema') || this.$sessionStorage.retrieve('sistema') || '';
  }

  login(credentials: Login): Observable<void> {
    if (this.getToken()) {
      this.logout().subscribe(result => this._login(credentials));
    } else {
      return this._login(credentials);
    }
  }
  _login(credentials: Login): Observable<void> {
    return this.http
      .post<JwtToken>(SERVER_API_URL + 'api/authenticate', credentials)
      .pipe(map(response => this.authenticateSuccess(response, credentials.rememberMe)));
  }

  logout(): Observable<void> {
    return new Observable(observer => {
      this.$localStorage.clear('authenticationToken');
      this.$sessionStorage.clear('authenticationToken');
      this.$localStorage.clear('tenant_uuid');
      this.$sessionStorage.clear('tenant_uuid');
      this.$localStorage.clear('sistema');
      this.$sessionStorage.clear('sistema');
      observer.complete();
    });
  }

  private authenticateSuccess(response: JwtToken, rememberMe: boolean): void {
    const jwt = response.id_token;
    const tenantUuid = response.tenant_uuid;
    const sistema = response.sistema;
    if (rememberMe) {
      this.$localStorage.store('authenticationToken', jwt);
      this.$localStorage.store('tenant_uuid', tenantUuid);
      this.$localStorage.store('sistema', sistema);
    } else {
      this.$sessionStorage.store('authenticationToken', jwt);
      this.$sessionStorage.store('tenant_uuid', tenantUuid);
      this.$sessionStorage.store('sistema', sistema);
    }
  }
}
