import { IBanco } from './banco.model';
import { IParceiro } from './parceiro.model';
import { IConta } from './conta.model';

export interface IAgenciabancaria {
  id?: number;
  ageNumero?: string;
  ageDigito?: string;
  ageAgencia?: string;
  ageDescricao?: string;
  ageSituacao?: boolean;
  banCodigobancario?: string;
  banco?: IBanco;
  parceiro?: IParceiro;
  conta?: IConta;
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
    public banco?: IBanco,
    public parceiro?: IParceiro,
    public conta?: IConta
  ) {
    this.ageSituacao = this.ageSituacao || false;
  }
}
