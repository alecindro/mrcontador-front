import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '../app.constants';
import { createRequestOption } from '../shared/util/request-util';
import { IContador } from '../model/contador.model';
import { TipoSistema } from '../shared/constants/TipoSistema';

type EntityResponseType = HttpResponse<IContador>;
type EntityArrayResponseType = HttpResponse<IContador[]>;

@Injectable({ providedIn: 'root' })
export class ContadorService {
  public resourceUrl = SERVER_API_URL + 'api/contadors';
  public resourceTenantUrl = SERVER_API_URL + 'api/contadors/tenant';
  private tipoSistema: TipoSistema = TipoSistema.DOMINIO_SISTEMAS;
  constructor(protected http: HttpClient) {}

  create(contador: IContador): Observable<EntityResponseType> {
    return this.http.post<IContador>(this.resourceUrl, contador, { observe: 'response' });
  }

  update(contador: IContador): Observable<EntityResponseType> {
    return this.http.put<IContador>(this.resourceUrl, contador, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IContador>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
  findByDatasource(datasource: string): Observable<EntityResponseType> {
    return this.http.get<IContador>(`${this.resourceTenantUrl}/${datasource}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IContador[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
  getTipoSistema(): TipoSistema {
    return this.tipoSistema;
  }
  setTipoSistema(value: string): void {
    this.tipoSistema = TipoSistema[value];
  }
}
