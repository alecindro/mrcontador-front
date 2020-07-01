import { Moment } from 'moment';

export interface IParceiro {
  id?: number;
  par_descricao?: string;
  par_razaosocial?: string;
  par_tipopessoa?: string;
  par_cnpjcpf?: string;
  par_rgie?: string;
  par_obs?: string;
  par_datacadastro?: Moment;
  spa_codigo?: number;
  logradouro?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  area_atuacao?: string;
  comercio?: boolean;
  nfc_e?: boolean;
  danfe?: boolean;
  servico?: boolean;
  nfs_e?: boolean;
  transportadora?: boolean;
  conhec_transporte?: boolean;
  industria?: boolean;
  ct?: boolean;
  outras?: string;
}

export class Parceiro implements IParceiro {
  constructor(
    public id?: number,
    public par_descricao?: string,
    public par_razaosocial?: string,
    public par_tipopessoa?: string,
    public par_cnpjcpf?: string,
    public par_rgie?: string,
    public par_obs?: string,
    public par_datacadastro?: Moment,
    public spa_codigo?: number,
    public logradouro?: string,
    public cep?: string,
    public cidade?: string,
    public estado?: string,
    public area_atuacao?: string,
    public comercio?: boolean,
    public nfc_e?: boolean,
    public danfe?: boolean,
    public servico?: boolean,
    public nfs_e?: boolean,
    public transportadora?: boolean,
    public conhec_transporte?: boolean,
    public industria?: boolean,
    public ct?: boolean,
    public outras?: string
  ) {
    this.comercio = this.comercio || false;
    this.nfc_e = this.nfc_e || false;
    this.danfe = this.danfe || false;
    this.servico = this.servico || false;
    this.nfs_e = this.nfs_e || false;
    this.transportadora = this.transportadora || false;
    this.conhec_transporte = this.conhec_transporte || false;
    this.industria = this.industria || false;
    this.ct = this.ct || false;
  }
}
