import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ISocio } from 'app/shared/model/socio.model';

type EntityResponseType = HttpResponse<ISocio>;
type EntityArrayResponseType = HttpResponse<ISocio[]>;

@Injectable({ providedIn: 'root' })
export class SocioService {
  public resourceUrl = SERVER_API_URL + 'api/socios';

  constructor(protected http: HttpClient) {}

  create(socio: ISocio): Observable<EntityResponseType> {
    return this.http.post<ISocio>(this.resourceUrl, socio, { observe: 'response' });
  }

  update(socio: ISocio): Observable<EntityResponseType> {
    return this.http.put<ISocio>(this.resourceUrl, socio, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISocio>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISocio[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
