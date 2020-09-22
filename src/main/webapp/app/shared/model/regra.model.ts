import { Moment } from 'moment';
import { IParceiro } from './parceiro.model';

export interface IRegra {
  id?: number;
  regDescricao?: string;
  regConta?: number;
  regHistorico?: string;
  regTodos?: string;
  dataCadastro?: Moment;
  parceiro?: IParceiro;
  aplicacao?: boolean;
}

export class Regra implements IRegra {
  constructor(
    public id?: number,
    public regDescricao?: string,
    public regConta?: number,
    public regHistorico?: string,
    public regTodos?: string,
    public dataCadastro?: Moment,
    public parceiro?: IParceiro,
    public aplicacao?: boolean
  ) {}
}
