import { Moment } from 'moment';

export interface IComprovante {
  id?: number;
  par_codigo?: number;
  age_codigo?: number;
  com_cnpj?: string;
  com_beneficiario?: string;
  com_documento?: string;
  com_datavencimento?: Moment;
  com_datapagamento?: Moment;
  com_valordocumento?: number;
  com_valorpagamento?: number;
  com_observacao?: string;
}

export class Comprovante implements IComprovante {
  constructor(
    public id?: number,
    public par_codigo?: number,
    public age_codigo?: number,
    public com_cnpj?: string,
    public com_beneficiario?: string,
    public com_documento?: string,
    public com_datavencimento?: Moment,
    public com_datapagamento?: Moment,
    public com_valordocumento?: number,
    public com_valorpagamento?: number,
    public com_observacao?: string
  ) {}
}
