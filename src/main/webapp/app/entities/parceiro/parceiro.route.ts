import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IParceiro, Parceiro } from 'app/model/parceiro.model';
import { ParceiroService } from '../../services/parceiro.service';
import { ParceiroDetailComponent } from './parceiro-detail.component';
import { ParceiroDashComponent } from './parceiro-dash.component';
import { ParceiroCreateComponent } from './parceiro-create.component';

@Injectable({ providedIn: 'root' })
export class ParceiroResolve implements Resolve<IParceiro> {
  constructor(private service: ParceiroService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IParceiro> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((parceiro: HttpResponse<Parceiro>) => {
          if (parceiro.body) {
            return of(parceiro.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Parceiro());
  }
}

export const parceiroRoute: Routes = [
  {
    path: '',
    component: ParceiroDashComponent,
    data: {
      authorities: [Authority.USER, Authority.ADMIN],
      defaultSort: 'id,asc',
      pageTitle: 'mrcontadorFrontApp.parceiro.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ParceiroDetailComponent,
    resolve: {
      parceiro: ParceiroResolve,
    },
    data: {
      authorities: [Authority.USER, Authority.ADMIN],
      pageTitle: 'mrcontadorFrontApp.parceiro.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ParceiroCreateComponent,
    resolve: {
      parceiro: ParceiroResolve,
    },
    data: {
      authorities: [Authority.USER, Authority.ADMIN],
      pageTitle: 'mrcontadorFrontApp.parceiro.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ParceiroCreateComponent,
    resolve: {
      parceiro: ParceiroResolve,
    },
    data: {
      authorities: [Authority.USER, Authority.ADMIN],
      pageTitle: 'mrcontadorFrontApp.parceiro.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
