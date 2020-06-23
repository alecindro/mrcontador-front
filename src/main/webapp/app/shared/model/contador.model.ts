export interface IContador {
  id?: number;
  razao?: string;
  fantasia?: string;
  telefones?: string;
  datasource?: string;
  cnpj?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  email?: string;
}

export class Contador implements IContador {
  constructor(
    public id?: number,
    public razao?: string,
    public fantasia?: string,
    public telefones?: string,
    public datasource?: string,
    public cnpj?: string,
    public cidade?: string,
    public estado?: string,
    public cep?: string,
    public email?: string
  ) {}
}
