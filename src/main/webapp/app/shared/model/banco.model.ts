export interface IBanco {
  id?: number;
  ban_descricao?: string;
  ban_codigobancario?: number;
  ban_sigla?: string;
  ban_ispb?: number;
}

export class Banco implements IBanco {
  constructor(
    public id?: number,
    public ban_descricao?: string,
    public ban_codigobancario?: number,
    public ban_sigla?: string,
    public ban_ispb?: number
  ) {}
}
