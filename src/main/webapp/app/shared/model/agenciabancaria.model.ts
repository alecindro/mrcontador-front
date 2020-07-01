import { IBanco } from './banco.model';
import { IParceiro } from './parceiro.model';

export interface IAgenciabancaria {
  id?: number;
  age_numero?: string;
  age_digito?: string;
  age_agencia?: string;
  age_descricao?: string;
  age_situacao?: boolean;
  bancoId?: number;
  parceiroId?: number;
}

export class Agenciabancaria implements IAgenciabancaria {
  constructor(
    public id?: number,
    public age_numero?: string,
    public age_digito?: string,
    public age_agencia?: string,
    public age_descricao?: string,
    public age_situacao?: boolean,
    public bancoId?: number,
    public parceiroId?: number
  ) {
    this.age_situacao = this.age_situacao || false;
  }
}

export class AgenciabancariaDTO implements IAgenciabancaria {
  constructor(
    public id?: number,
    public age_numero?: string,
    public age_digito?: string,
    public age_agencia?: string,
    public age_descricao?: string,
    public age_situacao?: boolean,
    public bancoId?: number,
    public parceiroId?: number,
    public banco?: IBanco,
    public parceiro?: IParceiro
  ) {
    this.age_situacao = this.age_situacao || false;
  }
}
