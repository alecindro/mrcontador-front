import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { INotafiscal } from 'app/shared/model/notafiscal.model';

type EntityResponseType = HttpResponse<INotafiscal>;
type EntityArrayResponseType = HttpResponse<INotafiscal[]>;

@Injectable({ providedIn: 'root' })
export class NotafiscalService {
  public resourceUrl = SERVER_API_URL + 'api/notafiscals';

  constructor(protected http: HttpClient) {}

  create(notafiscal: INotafiscal): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(notafiscal);
    return this.http
      .post<INotafiscal>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(notafiscal: INotafiscal): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(notafiscal);
    return this.http
      .put<INotafiscal>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<INotafiscal>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<INotafiscal[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(notafiscal: INotafiscal): INotafiscal {
    const copy: INotafiscal = Object.assign({}, notafiscal, {
      not_datasaida: notafiscal.not_datasaida && notafiscal.not_datasaida.isValid() ? notafiscal.not_datasaida.toJSON() : undefined,
      not_dataparcela: notafiscal.not_dataparcela && notafiscal.not_dataparcela.isValid() ? notafiscal.not_dataparcela.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.not_datasaida = res.body.not_datasaida ? moment(res.body.not_datasaida) : undefined;
      res.body.not_dataparcela = res.body.not_dataparcela ? moment(res.body.not_dataparcela) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((notafiscal: INotafiscal) => {
        notafiscal.not_datasaida = notafiscal.not_datasaida ? moment(notafiscal.not_datasaida) : undefined;
        notafiscal.not_dataparcela = notafiscal.not_dataparcela ? moment(notafiscal.not_dataparcela) : undefined;
      });
    }
    return res;
  }
}
