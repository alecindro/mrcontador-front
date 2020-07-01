import { Moment } from 'moment';

export interface INotaservico {
  id?: number;
  nse_numero?: number;
  nse_descricao?: string;
  nse_cnpj?: string;
  nse_empresa?: string;
  nse_datasaida?: Moment;
  nse_valornota?: number;
  nse_dataparcela?: Moment;
  nse_valorparcela?: number;
  tno_codigo?: number;
  nse_parcela?: string;
  parceiroId?: number;
}

export class Notaservico implements INotaservico {
  constructor(
    public id?: number,
    public nse_numero?: number,
    public nse_descricao?: string,
    public nse_cnpj?: string,
    public nse_empresa?: string,
    public nse_datasaida?: Moment,
    public nse_valornota?: number,
    public nse_dataparcela?: Moment,
    public nse_valorparcela?: number,
    public tno_codigo?: number,
    public nse_parcela?: string,
    public parceiroId?: number
  ) {}
}
