import { Moment } from 'moment';
import { IParceiro } from './parceiro.model';

export interface INotaservico {
  id?: number;
  nseNumero?: number;
  nseDescricao?: string;
  nseCnpj?: string;
  nseEmpresa?: string;
  nseDatasaida?: Moment;
  nseValornota?: number;
  nseDataparcela?: Moment;
  nseValorparcela?: number;
  tnoCodigo?: number;
  nseParcela?: string;
  parceiro?: IParceiro;
  processado?: boolean;
}

export class Notaservico implements INotaservico {
  constructor(
    public id?: number,
    public nseNumero?: number,
    public nseDescricao?: string,
    public nseCnpj?: string,
    public nseEmpresa?: string,
    public nseDatasaida?: Moment,
    public nseValornota?: number,
    public nseDataparcela?: Moment,
    public nseValorparcela?: number,
    public tnoCodigo?: number,
    public nseParcela?: string,
    public parceiro?: IParceiro,
    public processado?: boolean
  ) {}
}
