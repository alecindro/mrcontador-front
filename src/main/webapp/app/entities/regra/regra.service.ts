import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IRegra } from 'app/shared/model/regra.model';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

type EntityResponseType = HttpResponse<IRegra>;
type EntityArrayResponseType = HttpResponse<IRegra[]>;

@Injectable({ providedIn: 'root' })
export class RegraService {
  public resourceUrl = SERVER_API_URL + 'api/regras';

  constructor(protected http: HttpClient) {}

  create(regra: IRegra): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(regra);
    return this.http
      .post<IRegra>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(regra: IRegra): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(regra);
    return this.http
      .put<IRegra>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IRegra>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IRegra[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(regra: IRegra): IRegra {
    const copy: IRegra = Object.assign({}, regra, {
      dataCadastro: regra.dataCadastro && regra.dataCadastro.isValid() ? regra.dataCadastro.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dataCadastro = res.body.dataCadastro ? moment(res.body.dataCadastro) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((regra: IRegra) => {
        regra.dataCadastro = regra.dataCadastro ? moment(regra.dataCadastro) : undefined;
      });
    }
    return res;
  }
}
