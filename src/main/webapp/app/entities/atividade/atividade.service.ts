import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IAtividade } from 'app/shared/model/atividade.model';

type EntityResponseType = HttpResponse<IAtividade>;
type EntityArrayResponseType = HttpResponse<IAtividade[]>;

@Injectable({ providedIn: 'root' })
export class AtividadeService {
  public resourceUrl = SERVER_API_URL + 'api/atividades';

  constructor(protected http: HttpClient) {}

  create(atividade: IAtividade): Observable<EntityResponseType> {
    return this.http.post<IAtividade>(this.resourceUrl, atividade, { observe: 'response' });
  }

  update(atividade: IAtividade): Observable<EntityResponseType> {
    return this.http.put<IAtividade>(this.resourceUrl, atividade, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAtividade>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAtividade[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
