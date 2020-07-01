import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IParceiro, Parceiro } from 'app/shared/model/parceiro.model';
import { ParceiroService } from './parceiro.service';
import { ParceiroComponent } from './parceiro.component';
import { ParceiroDetailComponent } from './parceiro-detail.component';
import { ParceiroUpdateComponent } from './parceiro-update.component';

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
    component: ParceiroComponent,
    data: {
      authorities: [Authority.USER],
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
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.parceiro.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ParceiroUpdateComponent,
    resolve: {
      parceiro: ParceiroResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.parceiro.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ParceiroUpdateComponent,
    resolve: {
      parceiro: ParceiroResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.parceiro.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
