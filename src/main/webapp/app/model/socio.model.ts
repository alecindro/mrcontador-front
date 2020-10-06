import { IParceiro } from 'app/model/parceiro.model';

export interface ISocio {
  id?: number;
  descricao?: string;
  nome?: string;
  parceiro?: IParceiro;
}

export class Socio implements ISocio {
  constructor(public id?: number, public descricao?: string, public nome?: string, public parceiro?: IParceiro) {}
}
