import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IExtrato, Extrato } from 'app/shared/model/extrato.model';
import { ExtratoService } from './extrato.service';
import { ExtratoComponent } from './extrato.component';
import { ExtratoDetailComponent } from './extrato-detail.component';
import { ExtratoUpdateComponent } from './extrato-update.component';

@Injectable({ providedIn: 'root' })
export class ExtratoResolve implements Resolve<IExtrato> {
  constructor(private service: ExtratoService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IExtrato> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((extrato: HttpResponse<Extrato>) => {
          if (extrato.body) {
            return of(extrato.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Extrato());
  }
}

export const extratoRoute: Routes = [
  {
    path: '',
    component: ExtratoComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'mrcontadorFrontApp.extrato.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExtratoDetailComponent,
    resolve: {
      extrato: ExtratoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.extrato.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExtratoUpdateComponent,
    resolve: {
      extrato: ExtratoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.extrato.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExtratoUpdateComponent,
    resolve: {
      extrato: ExtratoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.extrato.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
