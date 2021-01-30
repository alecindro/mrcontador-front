import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IArquivoerro, Arquivoerro } from 'app/model/arquivoerro.model';
import { ArquivoerroService } from './arquivoerro.service';
import { ArquivoerroComponent } from './arquivoerro.component';

@Injectable({ providedIn: 'root' })
export class ArquivoerroResolve implements Resolve<IArquivoerro> {
  constructor(private service: ArquivoerroService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IArquivoerro> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((arquivoerro: HttpResponse<Arquivoerro>) => {
          if (arquivoerro.body) {
            return of(arquivoerro.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Arquivoerro());
  }
}

export const arquivoerroRoute: Routes = [
  {
    path: '',
    component: ArquivoerroComponent,
    data: {
      authorities: [Authority.MRCONTADOR_MASTER],
      defaultSort: 'dataCadastro,desc',
      pageTitle: 'mrcontadorFrontApp.arquivoerro.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
