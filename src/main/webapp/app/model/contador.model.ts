export interface IContador {
  id?: number;
  razao?: string;
  fantasia?: string;
  telefones?: string;
  datasource?: string;
  cnpj?: string;
  logradouro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  email?: string;
  crc?: string;
  sistema?: string;
  pessoafisica?: boolean;
}

export class Contador implements IContador {
  constructor(
    public id?: number,
    public razao?: string,
    public fantasia?: string,
    public telefones?: string,
    public datasource?: string,
    public cnpj?: string,
    public logradouro?: string,
    public cidade?: string,
    public estado?: string,
    public cep?: string,
    public email?: string,
    public crc?: string,
    public sistema?: string,
    public pessoafisica?: boolean
  ) {}
}
