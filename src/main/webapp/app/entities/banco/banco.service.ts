import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IBanco } from 'app/shared/model/banco.model';

type EntityResponseType = HttpResponse<IBanco>;
type EntityArrayResponseType = HttpResponse<IBanco[]>;

@Injectable({ providedIn: 'root' })
export class BancoService {
  public resourceUrl = SERVER_API_URL + 'api/bancos';

  constructor(protected http: HttpClient) {}

  create(banco: IBanco): Observable<EntityResponseType> {
    return this.http.post<IBanco>(this.resourceUrl, banco, { observe: 'response' });
  }

  update(banco: IBanco): Observable<EntityResponseType> {
    return this.http.put<IBanco>(this.resourceUrl, banco, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBanco>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBanco[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
