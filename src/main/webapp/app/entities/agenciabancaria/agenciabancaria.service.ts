import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IAgenciabancaria } from 'app/shared/model/agenciabancaria.model';

type EntityResponseType = HttpResponse<IAgenciabancaria>;
type EntityArrayResponseType = HttpResponse<IAgenciabancaria[]>;

@Injectable({ providedIn: 'root' })
export class AgenciabancariaService {
  public resourceUrl = SERVER_API_URL + 'api/agenciabancarias';
  private agenciaSelected!: IAgenciabancaria;
  constructor(protected http: HttpClient) {}

  create(agenciabancaria: IAgenciabancaria): Observable<EntityResponseType> {
    return this.http.post<IAgenciabancaria>(this.resourceUrl, agenciabancaria, { observe: 'response' });
  }

  setAgenciaSelected(agenciaSelected: IAgenciabancaria): void {
    this.agenciaSelected = agenciaSelected;
  }
  getAgenciaSelected(): IAgenciabancaria {
    return this.agenciaSelected;
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
