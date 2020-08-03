import { Moment } from 'moment';
import { IParceiro } from './parceiro.model';
import { IAgenciabancaria } from './agenciabancaria.model';

export interface IExtrato {
  id?: number;
  extDatalancamento?: Moment;
  extHistorico?: string;
  extNumerodocumento?: string;
  extNumerocontrole?: string;
  extDebito?: number;
  extCredito?: number;
  extDescricao?: string;
  parceiro?: IParceiro;
  agenciabancaria?: IAgenciabancaria;
}

export class Extrato implements IExtrato {
  constructor(
    public id?: number,
    public extDatalancamento?: Moment,
    public extHistorico?: string,
    public extNumerodocumento?: string,
    public extNumerocontrole?: string,
    public extDebito?: number,
    public extCredito?: number,
    public extDescricao?: string,
    public parceiro?: IParceiro,
    public agenciabancaria?: IAgenciabancaria
  ) {}
}
