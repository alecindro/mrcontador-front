import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IAgenciabancaria, Agenciabancaria } from 'app/shared/model/agenciabancaria.model';
import { AgenciabancariaService } from './agenciabancaria.service';
import { AgenciabancariaComponent } from './agenciabancaria.component';
import { AgenciabancariaDetailComponent } from './agenciabancaria-detail.component';
import { AgenciabancariaUpdateComponent } from './agenciabancaria-update.component';

@Injectable({ providedIn: 'root' })
export class AgenciabancariaResolve implements Resolve<IAgenciabancaria> {
  constructor(private service: AgenciabancariaService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAgenciabancaria> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((agenciabancaria: HttpResponse<Agenciabancaria>) => {
          if (agenciabancaria.body) {
            return of(agenciabancaria.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Agenciabancaria());
  }
}

export const agenciabancariaRoute: Routes = [
  {
    path: '',
    component: AgenciabancariaComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'mrcontadorFrontApp.agenciabancaria.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AgenciabancariaDetailComponent,
    resolve: {
      agenciabancaria: AgenciabancariaResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.agenciabancaria.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AgenciabancariaUpdateComponent,
    resolve: {
      agenciabancaria: AgenciabancariaResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.agenciabancaria.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AgenciabancariaUpdateComponent,
    resolve: {
      agenciabancaria: AgenciabancariaResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.agenciabancaria.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
