import { IAgenciabancaria } from 'app/model/agenciabancaria.model';
import { IConta } from 'app/model/conta.model';

export class AgenciabancariaAplicacao {
  constructor(public agenciaBancaria: IAgenciabancaria, public conta?: IConta, public contemAplicacao?: boolean) {}
}
