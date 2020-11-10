import { Moment } from 'moment';
import { Agenciabancaria } from './agenciabancaria.model';
import { Atividade } from './atividade.model';
import { Socio } from './socio.model';
import { IConta } from './conta.model';

export interface IParceiro {
  id?: number;
  parDescricao?: string;
  parRazaosocial?: string;
  parTipopessoa?: string;
  parCnpjcpf?: string;
  parRgie?: string;
  parObs?: string;
  parDatacadastro?: Moment;
  spaCodigo?: number;
  logradouro?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  areAtuacao?: string;
  numero?: string;
  bairro?: string;
  porte?: string;
  abertura?: string;
  naturezaJuridica?: string;
  ultimaAtualizacao?: string;
  status?: string;
  tipo?: string;
  complemento?: string;
  email?: string;
  telefone?: string;
  dataSituacao?: string;
  efr?: string;
  motivoSituacao?: string;
  situacaoEspecial?: string;
  dataSituacaoEspecial?: string;
  capitalSocial?: string;
  enabled?: boolean;
  codExt?: string;
  cadastroStatus?: number;
  agenciabancarias?: Agenciabancaria[];
  atividades?: Atividade[];
  socios?: Socio[];
  despesaJuros?: IConta;
  despesaIof?: IConta;
  jurosAtivos?: IConta;
  descontosAtivos?: IConta;
  caixaConta?: IConta;
  despesasBancarias?: IConta;
  despesaTarifa?: IConta;
}

export class Parceiro implements IParceiro {
  constructor(
    public id?: number,
    public parDescricao?: string,
    public parRazaosocial?: string,
    public parTipopessoa?: string,
    public parCnpjcpf?: string,
    public parRgie?: string,
    public parObs?: string,
    public parDatacadastro?: Moment,
    public spaCodigo?: number,
    public logradouro?: string,
    public cep?: string,
    public cidade?: string,
    public estado?: string,
    public areAtuacao?: string,
    public numero?: string,
    public bairro?: string,
    public porte?: string,
    public abertura?: string,
    public naturezaJuridica?: string,
    public ultimaAtualizacao?: string,
    public status?: string,
    public tipo?: string,
    public complemento?: string,
    public email?: string,
    public telefone?: string,
    public dataSituacao?: string,
    public efr?: string,
    public motivoSituacao?: string,
    public situacaoEspecial?: string,
    public dataSituacaoEspecial?: string,
    public capitalSocial?: string,
    public enabled?: boolean,
    public codExt?: string,
    public cadastroStatus?: number,
    public agenciabancarias?: Agenciabancaria[],
    public atividades?: Atividade[],
    public socios?: Socio[],
    public despesaJuros?: IConta,
    public despesaIof?: IConta,
    public jurosAtivos?: IConta,
    public descontosAtivos?: IConta,
    public caixaConta?: IConta,
    public despesasBancarias?: IConta,
    public despesaTarifa?: IConta
  ) {}
}
