import { Moment } from 'moment';
import { IComprovante } from 'app/model/comprovante.model';
import { IParceiro } from 'app/model/parceiro.model';
import { INotafiscal } from 'app/model/notafiscal.model';
import { INotaservico } from 'app/model/notaservico.model';
import { IAgenciabancaria } from 'app/model/agenciabancaria.model';
import { IConta } from './conta.model';
import { IExtrato } from './extrato.model';
import { IRegra } from './regra.model';

export interface IInteligent {
  id?: number;
  historico?: string;
  historicofinal?: string;
  datalancamento?: Moment;
  associado?: boolean;
  numerocontrole?: string;
  numerodocumento?: string;
  periodo?: string;
  debito?: number;
  credito?: number;
  datainicio?: Moment;
  datafim?: Moment;
  cnpj?: string;
  beneficiario?: string;
  comprovante?: IComprovante;
  parceiro?: IParceiro;
  notafiscal?: INotafiscal;
  notaservico?: INotaservico;
  conta?: IConta;
  extrato?: IExtrato;
  agenciabancaria?: IAgenciabancaria;
  regra?: IRegra;
}

export class Inteligent implements IInteligent {
  constructor(
    public id?: number,
    public historico?: string,
    public historicofinal?: string,
    public datalancamento?: Moment,
    public associado?: boolean,
    public periodo?: string,
    public numerocontrole?: string,
    public numerodocumento?: string,
    public debito?: number,
    public credito?: number,
    public datainicio?: Moment,
    public datafim?: Moment,
    public cnpj?: string,
    public beneficiario?: string,
    public comprovante?: IComprovante,
    public parceiro?: IParceiro,
    public notafiscal?: INotafiscal,
    public notaservico?: INotaservico,
    public conta?: IConta,
    public extrato?: IExtrato,
    public agenciabancaria?: IAgenciabancaria,
    public regra?: IRegra
  ) {
    this.associado = this.associado || false;
  }
}
