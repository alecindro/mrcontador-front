import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IArquivoerro } from 'app/model/arquivoerro.model';

type EntityResponseType = HttpResponse<IArquivoerro>;
type EntityArrayResponseType = HttpResponse<IArquivoerro[]>;

@Injectable({ providedIn: 'root' })
export class ArquivoerroService {
  public resourceUrl = SERVER_API_URL + 'api/arquivo-erros';

  constructor(protected http: HttpClient) {}

  create(arquivoerro: IArquivoerro): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(arquivoerro);
    return this.http
      .post<IArquivoerro>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(arquivoerro: IArquivoerro): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(arquivoerro);
    return this.http
      .put<IArquivoerro>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IArquivoerro>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IArquivoerro[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(arquivoerro: IArquivoerro): IArquivoerro {
    const copy: IArquivoerro = Object.assign({}, arquivoerro, {
      dataCadastro: arquivoerro.dataCadastro && arquivoerro.dataCadastro.isValid() ? arquivoerro.dataCadastro.toJSON() : undefined,
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
      res.body.forEach((arquivoerro: IArquivoerro) => {
        arquivoerro.dataCadastro = arquivoerro.dataCadastro ? moment(arquivoerro.dataCadastro) : undefined;
      });
    }
    return res;
  }
}
