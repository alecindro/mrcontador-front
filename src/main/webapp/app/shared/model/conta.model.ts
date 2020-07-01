export interface IConta {
  id?: number;
  con_conta?: number;
  con_classificacao?: string;
  con_tipo?: string;
  con_descricao?: string;
  con_cnpj?: string;
  con_grau?: number;
  parceiroId?: number;
}

export class Conta implements IConta {
  constructor(
    public id?: number,
    public con_conta?: number,
    public con_classificacao?: string,
    public con_tipo?: string,
    public con_descricao?: string,
    public con_cnpj?: string,
    public con_grau?: number,
    public parceiroId?: number
  ) {}
}
