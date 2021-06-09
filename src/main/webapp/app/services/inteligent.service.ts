import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IInteligent } from 'app/model/inteligent.model';
import { InteligentNfDTO } from '../model/inteligentNFDto';
import { StatsLine, InteligentStatsUtil, IStats } from 'app/model/inteligentStats.model';
import { ParceiroService } from './parceiro.service';

type EntityResponseType = HttpResponse<IInteligent>;
type EntityArrayResponseType = HttpResponse<IInteligent[]>;

type StatsArrayResponseType = HttpResponse<StatsLine[]>;

@Injectable({ providedIn: 'root' })
export class InteligentService {
  public resourceUrl = SERVER_API_URL + 'api/inteligents';
  public periodoUrl = SERVER_API_URL + 'api/inteligents/periodo';
  public resourceUrlFunction = SERVER_API_URL + 'api/inteligents/function';
  private associateNFUrl = SERVER_API_URL + 'api/inteligents/nf';
  private statsUrl = SERVER_API_URL + 'api/inteligents/stats';

  constructor(protected http: HttpClient, protected parceiroService: ParceiroService) {}

  create(inteligent: IInteligent): Observable<EntityResponseType> {
    return this.http
      .post<IInteligent>(this.resourceUrl, inteligent, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(inteligent: IInteligent): Observable<EntityResponseType> {
    return this.http
      .put<IInteligent>(this.resourceUrl, inteligent, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  associateNf(inteligentNfDTO: InteligentNfDTO): Observable<any> {
    return this.http.post(this.associateNFUrl, inteligentNfDTO);
  }
  removeNf(inteligent: IInteligent): Observable<any> {
    return this.http.put(this.associateNFUrl, inteligent);
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IInteligent>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IInteligent[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  queryPeriodo(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<string[]>(this.periodoUrl, { params: options, observe: 'response' });
  }

  queryStats(req?: any): Observable<StatsArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<StatsLine[]>(this.statsUrl, { params: options, observe: 'response' })
      .pipe(map((res: StatsArrayResponseType) => this.convertStatsFromServer(res)));
  }

  queryFuntion(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IInteligent[]>(this.resourceUrlFunction, { params: options, observe: 'response' });
  }

  protected convertDateFromClient(inteligent: IInteligent): IInteligent {
    const copy: IInteligent = Object.assign({}, inteligent, {
      datalancamento: inteligent.datalancamento && inteligent.datalancamento.isValid() ? inteligent.datalancamento.toJSON() : undefined,
      datainicio: inteligent.datainicio && inteligent.datainicio.isValid() ? inteligent.datainicio.toJSON() : undefined,
      datafim: inteligent.datafim && inteligent.datafim.isValid() ? inteligent.datafim.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.datalancamento = res.body.datalancamento ? moment(res.body.datalancamento) : undefined;
      res.body.datainicio = res.body.datainicio ? moment(res.body.datainicio) : undefined;
      res.body.datafim = res.body.datafim ? moment(res.body.datafim) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((inteligent: IInteligent) => {
        inteligent.datalancamento = inteligent.datalancamento ? moment(inteligent.datalancamento) : undefined;
        inteligent.datainicio = inteligent.datainicio ? moment(inteligent.datainicio) : undefined;
        inteligent.datafim = inteligent.datafim ? moment(inteligent.datafim) : undefined;
      });
    }
    return res;
  }

  protected convertStatsFromServer(res: StatsArrayResponseType): StatsArrayResponseType {
    if (res.body) {
      res.body.forEach((_stats: StatsLine) => {
        _stats.inteligentStats.forEach((dto: IStats) => {
          dto.maxDate = moment(dto.maxDate);
        });
        _stats.parceiro = this.parceiroService.convertDateFromJson(_stats.parceiro);
        InteligentStatsUtil.processDataBar(_stats);
      });
    }
    return res;
  }
}
