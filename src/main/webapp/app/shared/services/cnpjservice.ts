import { Injectable } from '@angular/core';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CnpjModel } from './cnpjmodel';

type EntityResponseType = HttpResponse<CnpjModel>;

@Injectable({ providedIn: 'root' })
export class CnpjService {
  public resourceUrl = 'https://www.receitaws.com.br/v1/cnpj/';

  constructor(protected http: HttpClient) {}

  query(cnpj: string): Observable<EntityResponseType> {
    return this.http.get<CnpjModel>(this.resourceUrl + cnpj, { observe: 'response' });
  }
}
