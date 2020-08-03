import { Moment } from 'moment';

export interface IComprovante {
  id?: number;
  parCodigo?: number;
  ageCodigo?: number;
  comCnpj?: string;
  comBeneficiario?: string;
  comDocumento?: string;
  comDatavencimento?: Moment;
  comDatapagamento?: Moment;
  comValordocumento?: number;
  comValorpagamento?: number;
  comObservacao?: string;
}

export class Comprovante implements IComprovante {
  constructor(
    public id?: number,
    public parCodigo?: number,
    public ageCodigo?: number,
    public comCnpj?: string,
    public comBeneficiario?: string,
    public comDocumento?: string,
    public comDatavencimento?: Moment,
    public comDatapagamento?: Moment,
    public comValordocumento?: number,
    public comValorpagamento?: number,
    public comObservacao?: string
  ) {}
}
