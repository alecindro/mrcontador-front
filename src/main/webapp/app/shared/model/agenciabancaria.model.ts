import { IBanco } from './banco.model';
import { IParceiro } from './parceiro.model';

export interface IAgenciabancaria {
  id?: number;
  ageNumero?: string;
  ageDigito?: string;
  ageAgencia?: string;
  ageDescricao?: string;
  ageSituacao?: boolean;
  banCodigobancario?: string;
  conConta?: string;
  banco?: IBanco;
  parceiro?: IParceiro;
}

export class Agenciabancaria implements IAgenciabancaria {
  constructor(
    public id?: number,
    public ageNumero?: string,
    public ageDigito?: string,
    public ageAgencia?: string,
    public ageDescricao?: string,
    public ageSituacao?: boolean,
    public banCodigobancario?: string,
    public conConta?: string,
    public banco?: IBanco,
    public parceiro?: IParceiro
  ) {
    this.ageSituacao = this.ageSituacao || false;
  }
}
