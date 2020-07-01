import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IRegra } from 'app/shared/model/regra.model';

type EntityResponseType = HttpResponse<IRegra>;
type EntityArrayResponseType = HttpResponse<IRegra[]>;

@Injectable({ providedIn: 'root' })
export class RegraService {
  public resourceUrl = SERVER_API_URL + 'api/regras';

  constructor(protected http: HttpClient) {}

  create(regra: IRegra): Observable<EntityResponseType> {
    return this.http.post<IRegra>(this.resourceUrl, regra, { observe: 'response' });
  }

  update(regra: IRegra): Observable<EntityResponseType> {
    return this.http.put<IRegra>(this.resourceUrl, regra, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRegra>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRegra[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
