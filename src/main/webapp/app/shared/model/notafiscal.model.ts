import { Moment } from 'moment';
import { IParceiro } from './parceiro.model';

export interface INotafiscal {
  id?: number;
  notNumero?: number;
  notDescricao?: string;
  notCnpj?: string;
  notEmpresa?: string;
  notDatasaida?: Moment;
  notValornota?: number;
  notDataparcela?: Moment;
  notValorparcela?: number;
  tnoCodigo?: number;
  notParcela?: string;
  parceiro?: IParceiro;
}

export class Notafiscal implements INotafiscal {
  constructor(
    public id?: number,
    public notNumero?: number,
    public notDescricao?: string,
    public notCnpj?: string,
    public notEmpresa?: string,
    public notDatasaida?: Moment,
    public notValornota?: number,
    public notDataparcela?: Moment,
    public notValorparcela?: number,
    public tnoCodigo?: number,
    public notParcela?: string,
    public parceiro?: IParceiro
  ) {}
}
