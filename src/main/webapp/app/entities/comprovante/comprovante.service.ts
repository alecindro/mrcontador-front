import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IComprovante } from 'app/shared/model/comprovante.model';

type EntityResponseType = HttpResponse<IComprovante>;
type EntityArrayResponseType = HttpResponse<IComprovante[]>;

@Injectable({ providedIn: 'root' })
export class ComprovanteService {
  public resourceUrl = SERVER_API_URL + 'api/comprovantes';

  constructor(protected http: HttpClient) {}

  create(comprovante: IComprovante): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(comprovante);
    return this.http
      .post<IComprovante>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(comprovante: IComprovante): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(comprovante);
    return this.http
      .put<IComprovante>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IComprovante>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IComprovante[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(comprovante: IComprovante): IComprovante {
    const copy: IComprovante = Object.assign({}, comprovante, {
      com_datavencimento:
        comprovante.com_datavencimento && comprovante.com_datavencimento.isValid() ? comprovante.com_datavencimento.toJSON() : undefined,
      com_datapagamento:
        comprovante.com_datapagamento && comprovante.com_datapagamento.isValid() ? comprovante.com_datapagamento.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.com_datavencimento = res.body.com_datavencimento ? moment(res.body.com_datavencimento) : undefined;
      res.body.com_datapagamento = res.body.com_datapagamento ? moment(res.body.com_datapagamento) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((comprovante: IComprovante) => {
        comprovante.com_datavencimento = comprovante.com_datavencimento ? moment(comprovante.com_datavencimento) : undefined;
        comprovante.com_datapagamento = comprovante.com_datapagamento ? moment(comprovante.com_datapagamento) : undefined;
      });
    }
    return res;
  }
}
