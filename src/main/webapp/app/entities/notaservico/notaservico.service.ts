import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { INotaservico } from 'app/shared/model/notaservico.model';

type EntityResponseType = HttpResponse<INotaservico>;
type EntityArrayResponseType = HttpResponse<INotaservico[]>;

@Injectable({ providedIn: 'root' })
export class NotaservicoService {
  public resourceUrl = SERVER_API_URL + 'api/notaservicos';

  constructor(protected http: HttpClient) {}

  create(notaservico: INotaservico): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(notaservico);
    return this.http
      .post<INotaservico>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(notaservico: INotaservico): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(notaservico);
    return this.http
      .put<INotaservico>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<INotaservico>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<INotaservico[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(notaservico: INotaservico): INotaservico {
    const copy: INotaservico = Object.assign({}, notaservico, {
      nse_datasaida: notaservico.nse_datasaida && notaservico.nse_datasaida.isValid() ? notaservico.nse_datasaida.toJSON() : undefined,
      nse_dataparcela:
        notaservico.nse_dataparcela && notaservico.nse_dataparcela.isValid() ? notaservico.nse_dataparcela.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.nse_datasaida = res.body.nse_datasaida ? moment(res.body.nse_datasaida) : undefined;
      res.body.nse_dataparcela = res.body.nse_dataparcela ? moment(res.body.nse_dataparcela) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((notaservico: INotaservico) => {
        notaservico.nse_datasaida = notaservico.nse_datasaida ? moment(notaservico.nse_datasaida) : undefined;
        notaservico.nse_dataparcela = notaservico.nse_dataparcela ? moment(notaservico.nse_dataparcela) : undefined;
      });
    }
    return res;
  }
}
