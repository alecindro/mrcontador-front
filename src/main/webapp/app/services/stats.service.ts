import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { StatsDTO } from 'app/shared/dto/statsDTO';
import { IStats } from 'app/model/inteligentStats.model';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

type EntityResponseType = HttpResponse<StatsDTO>;

@Injectable({ providedIn: 'root' })
export class StatsService {
  public resourceUrl = SERVER_API_URL + 'api/stats';
  constructor(protected http: HttpClient) {}

  get(parceiroId: number): Observable<EntityResponseType> {
    return this.http
      .get<StatsDTO>(`${this.resourceUrl}/${parceiroId}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertStatsFromServer(res)));
  }

  protected convertStatsFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      if (res.body.comprovanteStats) {
        res.body.comprovanteStats.forEach((_stats: IStats) => {
          this.converterData(_stats);
        });
      }
      if (res.body.extratoStats) {
        res.body.extratoStats.forEach((_stats: IStats) => {
          this.converterData(_stats);
        });
      }

      if (res.body.nfsStats) {
        res.body.nfsStats.forEach((_stats: IStats) => {
          this.converterData(_stats);
        });
      }
      if (res.body.inteligentStats) {
        res.body.inteligentStats.forEach((_stats: IStats) => {
          this.converterData(_stats);
        });
      }
    }
    return res;
  }

  private converterData(stats: IStats): void {
    stats.maxDate = moment(stats.maxDate);
  }
}
