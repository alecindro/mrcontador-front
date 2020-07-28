import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IParceiro } from 'app/shared/model/parceiro.model';

type EntityResponseType = HttpResponse<IParceiro>;
type EntityArrayResponseType = HttpResponse<IParceiro[]>;

@Injectable({ providedIn: 'root' })
export class ParceiroService {
  public resourceUrl = SERVER_API_URL + 'api/parceiros';
  private parceiroSelected!: IParceiro;
  constructor(protected http: HttpClient) {}

  create(parceiro: IParceiro): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(parceiro);
    return this.http
      .post<IParceiro>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  getParceiroSelected(): IParceiro {
    return this.parceiroSelected;
  }
  setParceiroSelected(parceiro: IParceiro): void {
    this.parceiroSelected = parceiro;
  }

  update(parceiro: IParceiro): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(parceiro);
    return this.http
      .put<IParceiro>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  createByCnpj(cnpj: string): Observable<EntityResponseType> {
    return this.http
      .get<IParceiro>(`${this.resourceUrl}/cnpj?cnpj=${cnpj}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IParceiro>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IParceiro[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(parceiro: IParceiro): IParceiro {
    const copy: IParceiro = Object.assign({}, parceiro, {
      par_datacadastro: parceiro.parDatacadastro && parceiro.parDatacadastro.isValid() ? parceiro.parDatacadastro.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.parDatacadastro = res.body.parDatacadastro ? moment(res.body.parDatacadastro) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((parceiro: IParceiro) => {
        parceiro.parDatacadastro = parceiro.parDatacadastro ? moment(parceiro.parDatacadastro) : undefined;
      });
    }
    return res;
  }
}
