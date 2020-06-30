import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IConta, Conta } from 'app/shared/model/conta.model';
import { ContaService } from './conta.service';
import { ContaComponent } from './conta.component';
import { ContaDetailComponent } from './conta-detail.component';
import { ContaUpdateComponent } from './conta-update.component';

@Injectable({ providedIn: 'root' })
export class ContaResolve implements Resolve<IConta> {
  constructor(private service: ContaService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IConta> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((conta: HttpResponse<Conta>) => {
          if (conta.body) {
            return of(conta.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Conta());
  }
}

export const contaRoute: Routes = [
  {
    path: '',
    component: ContaComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'mrcontadorFrontApp.conta.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ContaDetailComponent,
    resolve: {
      conta: ContaResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.conta.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ContaUpdateComponent,
    resolve: {
      conta: ContaResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.conta.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ContaUpdateComponent,
    resolve: {
      conta: ContaResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.conta.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
