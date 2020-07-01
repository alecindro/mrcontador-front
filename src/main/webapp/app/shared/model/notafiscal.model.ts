import { Moment } from 'moment';

export interface INotafiscal {
  id?: number;
  not_numero?: number;
  not_descricao?: string;
  not_cnpj?: string;
  not_empresa?: string;
  not_datasaida?: Moment;
  not_valornota?: number;
  not_dataparcela?: Moment;
  not_valorparcela?: number;
  tno_codigo?: number;
  not_parcela?: string;
  parceiroId?: number;
}

export class Notafiscal implements INotafiscal {
  constructor(
    public id?: number,
    public not_numero?: number,
    public not_descricao?: string,
    public not_cnpj?: string,
    public not_empresa?: string,
    public not_datasaida?: Moment,
    public not_valornota?: number,
    public not_dataparcela?: Moment,
    public not_valorparcela?: number,
    public tno_codigo?: number,
    public not_parcela?: string,
    public parceiroId?: number
  ) {}
}
