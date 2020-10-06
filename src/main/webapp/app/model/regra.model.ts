import { Moment } from 'moment';
import { IParceiro } from './parceiro.model';
import { IConta } from './conta.model';

export interface IRegra {
  id?: number;
  regDescricao?: string;
  regHistorico?: string;
  regTodos?: string;
  dataCadastro?: Moment;
  parceiro?: IParceiro;
  aplicacao?: boolean;
  tipoRegra?: string;
  conta?: IConta;
}

export class Regra implements IRegra {
  constructor(
    public id?: number,
    public regDescricao?: string,
    public regHistorico?: string,
    public regTodos?: string,
    public dataCadastro?: Moment,
    public parceiro?: IParceiro,
    public aplicacao?: boolean,
    public tipoRegra?: string,
    public conta?: IConta
  ) {}
}
