import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IAgenciabancaria } from 'app/model/agenciabancaria.model';
import { AgenciabancariaAplicacao } from 'app/shared/dto/agenciabancariaAplicacao';
import { IConta } from 'app/model/conta.model';
import { LocalStorageService } from 'ngx-webstorage';

type EntityResponseType = HttpResponse<IAgenciabancaria>;
type EntityArrayResponseType = HttpResponse<IAgenciabancaria[]>;

@Injectable({ providedIn: 'root' })
export class AgenciabancariaService {
  public resourceUrl = SERVER_API_URL + 'api/agenciabancarias';
  constructor(protected http: HttpClient, private $localStorage: LocalStorageService) {}

  create(agenciabancaria: IAgenciabancaria): Observable<EntityResponseType> {
    return this.http.post<IAgenciabancaria>(this.resourceUrl, agenciabancaria, { observe: 'response' });
  }

  createAplicao(agenciabancariaAplicacao: AgenciabancariaAplicacao): Observable<EntityResponseType> {
    return this.http.post<IAgenciabancaria>(this.resourceUrl + '/aplicacao', agenciabancariaAplicacao, { observe: 'response' });
  }

  createCaixa(conta: IConta): Observable<EntityResponseType> {
    return this.http.post<IAgenciabancaria>(this.resourceUrl + '/caixa', conta, { observe: 'response' });
  }

  setAgenciaSelected(agenciaSelected: IAgenciabancaria): void {
    this.$localStorage.store('agencia', agenciaSelected.id);
  }
  getAgenciaSelected(): number {
    return this.$localStorage.retrieve('agencia');
  }

  update(agenciabancaria: IAgenciabancaria): Observable<EntityResponseType> {
    return this.http.put<IAgenciabancaria>(this.resourceUrl, agenciabancaria, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAgenciabancaria>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAgenciabancaria[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
