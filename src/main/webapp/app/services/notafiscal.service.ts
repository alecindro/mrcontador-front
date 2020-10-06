import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { INotafiscal } from 'app/model/notafiscal.model';

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
      not_datasaida: notafiscal.notDatasaida && notafiscal.notDatasaida.isValid() ? notafiscal.notDatasaida.toJSON() : undefined,
      not_dataparcela: notafiscal.notDataparcela && notafiscal.notDataparcela.isValid() ? notafiscal.notDataparcela.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.notDatasaida = res.body.notDatasaida ? moment(res.body.notDatasaida) : undefined;
      res.body.notDataparcela = res.body.notDataparcela ? moment(res.body.notDataparcela) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((notafiscal: INotafiscal) => {
        notafiscal.notDatasaida = notafiscal.notDatasaida ? moment(notafiscal.notDatasaida) : undefined;
        notafiscal.notDataparcela = notafiscal.notDataparcela ? moment(notafiscal.notDataparcela) : undefined;
      });
    }
    return res;
  }
}
