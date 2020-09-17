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
        comprovante.comDatavencimento && comprovante.comDatavencimento.isValid() ? comprovante.comDatavencimento.toJSON() : undefined,
      com_datapagamento:
        comprovante.comDatapagamento && comprovante.comDatapagamento.isValid() ? comprovante.comDatapagamento.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.comDatavencimento = res.body.comDatavencimento ? moment(res.body.comDatavencimento) : undefined;
      res.body.comDatapagamento = res.body.comDatapagamento ? moment(res.body.comDatapagamento) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((comprovante: IComprovante) => {
        comprovante.comDatavencimento = comprovante.comDatavencimento ? moment(comprovante.comDatavencimento) : undefined;
        comprovante.comDatapagamento = comprovante.comDatapagamento ? moment(comprovante.comDatapagamento) : undefined;
      });
    }
    return res;
  }
}
