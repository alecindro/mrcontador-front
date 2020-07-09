export class CnpjModel {
  constructor(
    public data_situacao?: string,
    public motivo_situacao?: string,
    public nome?: string,
    public telefone?: string,
    public situacao?: string,
    public porte?: string,
    public abertura?: string,
    public natureza_juridica?: string,
    public fantasia?: string,
    public cnpj?: string,
    public ultima_atualizacao?: string,
    public status?: string,
    public tipo?: string,
    public logradouro?: string,
    public numero?: string,
    public complemento?: string,
    public cep?: string,
    public bairro?: string,
    public municipio?: string,
    public uf?: string,
    public email?: string,
    public efr?: string,
    public situacao_especial?: string,
    public data_situacao_especial?: string,
    public atividade_principal?: AtividadePrincipal[],
    public atividades_secundarias?: AtividadePrincipal[],
    public capital_social?: string,
    public qsa?: any[],
    public extra?: any,
    public billing?: Billing
  ) {}
}

export class AtividadePrincipal {
  constructor(public code?: string, public text?: string) {}
}

export class Billing {
  constructor(public free?: boolean, public database?: boolean) {}
}
