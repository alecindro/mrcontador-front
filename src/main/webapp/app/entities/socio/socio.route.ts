import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ISocio, Socio } from 'app/model/socio.model';
import { SocioService } from '../../services/socio.service';
import { SocioComponent } from './socio.component';
import { SocioDetailComponent } from './socio-detail.component';
import { SocioUpdateComponent } from './socio-update.component';

@Injectable({ providedIn: 'root' })
export class SocioResolve implements Resolve<ISocio> {
  constructor(private service: SocioService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISocio> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((socio: HttpResponse<Socio>) => {
          if (socio.body) {
            return of(socio.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Socio());
  }
}

export const socioRoute: Routes = [
  {
    path: '',
    component: SocioComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'mrcontadorFrontApp.socio.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SocioDetailComponent,
    resolve: {
      socio: SocioResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.socio.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SocioUpdateComponent,
    resolve: {
      socio: SocioResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.socio.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SocioUpdateComponent,
    resolve: {
      socio: SocioResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.socio.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
