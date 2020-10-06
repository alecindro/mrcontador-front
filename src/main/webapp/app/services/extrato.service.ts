import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IExtrato } from 'app/model/extrato.model';

type EntityResponseType = HttpResponse<IExtrato>;
type EntityArrayResponseType = HttpResponse<IExtrato[]>;

@Injectable({ providedIn: 'root' })
export class ExtratoService {
  public resourceUrl = SERVER_API_URL + 'api/extratoes';

  constructor(protected http: HttpClient) {}

  create(extrato: IExtrato): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(extrato);
    return this.http
      .post<IExtrato>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(extrato: IExtrato): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(extrato);
    return this.http
      .put<IExtrato>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IExtrato>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IExtrato[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(extrato: IExtrato): IExtrato {
    const copy: IExtrato = Object.assign({}, extrato, {
      ext_datalancamento: extrato.extDatalancamento && extrato.extDatalancamento.isValid() ? extrato.extDatalancamento.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.extDatalancamento = res.body.extDatalancamento ? moment(res.body.extDatalancamento) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((extrato: IExtrato) => {
        extrato.extDatalancamento = extrato.extDatalancamento ? moment(extrato.extDatalancamento) : undefined;
      });
    }
    return res;
  }
}
