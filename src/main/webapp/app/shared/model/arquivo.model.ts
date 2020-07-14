import { Moment } from 'moment';
import { IParceiro } from 'app/shared/model/parceiro.model';

export interface IArquivo {
  id?: number;
  nome?: string;
  nomeOriginal?: string;
  dataCadastro?: Moment;
  tipoArquivo?: string;
  tipoDoc?: string;
  s3Url?: string;
  s3Dir?: string;
  tamanho?: number;
  etag?: string;
  usuario?: string;
  parceiro?: IParceiro;
}

export class Arquivo implements IArquivo {
  constructor(
    public id?: number,
    public nome?: string,
    public nomeOriginal?: string,
    public dataCadastro?: Moment,
    public tipoArquivo?: string,
    public tipoDoc?: string,
    public s3Url?: string,
    public s3Dir?: string,
    public tamanho?: number,
    public etag?: string,
    public usuario?: string,
    public parceiro?: IParceiro
  ) {}
}
