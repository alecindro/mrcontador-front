import { IStats } from 'app/model/inteligentStats.model';

export class StatsDTO {
  constructor(
    public inteligentCount?: number,
    public extratoCount?: number,
    public comprovanteCount?: number,
    public notafiscalCount?: number,
    public inteligentStats?: IStats[],
    public extratoStats?: IStats[],
    public comprovanteStats?: IStats[],
    public nfsStats?: IStats[]
  ) {}
}
