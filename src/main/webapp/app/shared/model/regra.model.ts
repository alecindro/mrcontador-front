export interface IRegra {
  id?: number;
  par_codigo?: number;
  reg_descricao?: string;
  reg_conta?: number;
  reg_historico?: string;
  reg_todos?: string;
}

export class Regra implements IRegra {
  constructor(
    public id?: number,
    public par_codigo?: number,
    public reg_descricao?: string,
    public reg_conta?: number,
    public reg_historico?: string,
    public reg_todos?: string
  ) {}
}
