import { Moment } from 'moment';
import { IParceiro } from './parceiro.model';
import { IAgenciabancaria } from './agenciabancaria.model';
import { IArquivo } from './arquivo.model';

export interface IExtrato {
  id?: number;
  extDatalancamento?: Moment;
  extHistorico?: string;
  extNumerodocumento?: string;
  extNumerocontrole?: string;
  extDebito?: number;
  extCredito?: number;
  extDescricao?: string;
  infoAdicional?: string;
  parceiro?: IParceiro;
  agenciabancaria?: IAgenciabancaria;
  arquivo?: IArquivo;
  processado?: boolean;
  periodo: string;
}

export class Extrato implements IExtrato {
  constructor(
    public periodo: string,
    public id?: number,
    public extDatalancamento?: Moment,
    public extHistorico?: string,
    public extNumerodocumento?: string,
    public extNumerocontrole?: string,
    public extDebito?: number,
    public extCredito?: number,
    public extDescricao?: string,
    public infoAdicional?: string,
    public parceiro?: IParceiro,
    public agenciabancaria?: IAgenciabancaria,
    public arquivo?: IArquivo,
    public processado?: boolean
  ) {}
}
