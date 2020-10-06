import { IParceiro } from 'app/model/parceiro.model';

export interface IAtividade {
  id?: number;
  descricao?: string;
  code?: string;
  tipo?: string;
  parceiro?: IParceiro;
}

export class Atividade implements IAtividade {
  constructor(public id?: number, public descricao?: string, public code?: string, public tipo?: string, public parceiro?: IParceiro) {}
}
