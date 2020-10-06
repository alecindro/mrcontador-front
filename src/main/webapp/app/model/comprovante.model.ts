import { Moment } from 'moment';
import { IAgenciabancaria } from './agenciabancaria.model';
import { IArquivo } from './arquivo.model';

export interface IComprovante {
  id?: number;
  comCnpj?: string;
  comBeneficiario?: string;
  comDocumento?: string;
  comDatavencimento?: Moment;
  comDatapagamento?: Moment;
  comValordocumento?: number;
  comValorpagamento?: number;
  juros?: number;
  desconto?: number;
  comObservacao?: string;
  competencia?: string;
  codigoRecolhimento?: string;
  agenciabancaria?: IAgenciabancaria;
  arquivo?: IArquivo;
  processado?: boolean;
}

export class Comprovante implements IComprovante {
  constructor(
    public id?: number,
    public comCnpj?: string,
    public comBeneficiario?: string,
    public comDocumento?: string,
    public comDatavencimento?: Moment,
    public comDatapagamento?: Moment,
    public comValordocumento?: number,
    public comValorpagamento?: number,
    public juros?: number,
    public desconto?: number,
    public comObservacao?: string,
    public competencia?: string,
    public codigoRecolhimento?: string,
    public agenciabancaria?: IAgenciabancaria,
    public arquivo?: IArquivo,
    public processado?: boolean
  ) {}
}
