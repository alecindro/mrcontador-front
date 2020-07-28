export interface IConta {
  id?: number;
  conConta?: number;
  conClassificacao?: string;
  conTipo?: string;
  conDescricao?: string;
  conCnpj?: string;
  conGrau?: number;
  parceiroId?: number;
}

export class Conta implements IConta {
  constructor(
    public id?: number,
    public conConta?: number,
    public conClassificacao?: string,
    public conTipo?: string,
    public conDescricao?: string,
    public conCnpj?: string,
    public conGrau?: number,
    public parceiroId?: number
  ) {}
}
