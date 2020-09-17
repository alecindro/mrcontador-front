import { Injectable } from '@angular/core';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { ViaCepModel } from './viacepmodel';
import { Observable } from 'rxjs';

type EntityResponseType = HttpResponse<ViaCepModel>;

@Injectable({ providedIn: 'root' })
export class ViaCepService {
  public resourceUrl = 'https://viacep.com.br/ws/';

  constructor(protected http: HttpClient) {}

  query(cep: string): Observable<EntityResponseType> {
    return this.http.get<ViaCepModel>(this.resourceUrl + cep + '/json/', { observe: 'response' });
  }
}
