export interface IBanco {
  id?: number;
  banDescricao?: string;
  banCodigobancario?: string;
  banSigla?: string;
  banIspb?: number;
}

export class Banco implements IBanco {
  constructor(
    public id?: number,
    public banDescricao?: string,
    public banCodigobancario?: string,
    public banSigla?: string,
    public banIspb?: number
  ) {}
}
