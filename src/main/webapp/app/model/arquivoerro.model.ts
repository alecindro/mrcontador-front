import { Moment } from 'moment';
import { IContador } from './contador.model';
export interface IArquivoerro {
  id?: number;
  nome?: string;
  nomeOriginal?: string;
  tipoArquivo?: string;
  s3Url?: string;
  s3Dir?: string;
  dataCadastro?: Moment;
  usuario?: string;
  schema?: string;
  tamanho?: number;
  parceiro?: string;
  parceiroId?: number;
  contador?: IContador;
  processado?: boolean;
  tipoDocumento?: string;
}

export class Arquivoerro implements IArquivoerro {
  constructor(
    public id?: number,
    public nome?: string,
    public nomeOriginal?: string,
    public tipoArquivo?: string,
    public s3Url?: string,
    public s3Dir?: string,
    public dataCadastro?: Moment,
    public usuario?: string,
    public schema?: string,
    public tamanho?: number,
    public parceiro?: string,
    public parceiroId?: number,
    public contador?: IContador,
    public processado?: boolean,
    public tipoDocumento?: string
  ) {}
}
