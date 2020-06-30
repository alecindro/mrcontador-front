import { Moment } from 'moment';

export interface IExtrato {
  id?: number;
  ext_datalancamento?: Moment;
  ext_historico?: string;
  ext_numerodocumento?: string;
  ext_numerocontrole?: string;
  ext_debito?: number;
  ext_credito?: number;
  ext_descricao?: string;
  parceiroId?: number;
  agenciabancariaId?: number;
}

export class Extrato implements IExtrato {
  constructor(
    public id?: number,
    public ext_datalancamento?: Moment,
    public ext_historico?: string,
    public ext_numerodocumento?: string,
    public ext_numerocontrole?: string,
    public ext_debito?: number,
    public ext_credito?: number,
    public ext_descricao?: string,
    public parceiroId?: number,
    public agenciabancariaId?: number
  ) {}
}
