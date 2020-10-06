import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IBanco, Banco } from 'app/model/banco.model';
import { BancoService } from '../../services/banco.service';
import { BancoComponent } from './banco.component';
import { BancoDetailComponent } from './banco-detail.component';
import { BancoUpdateComponent } from './banco-update.component';

@Injectable({ providedIn: 'root' })
export class BancoResolve implements Resolve<IBanco> {
  constructor(private service: BancoService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBanco> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((banco: HttpResponse<Banco>) => {
          if (banco.body) {
            return of(banco.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Banco());
  }
}

export const bancoRoute: Routes = [
  {
    path: '',
    component: BancoComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'mrcontadorFrontApp.banco.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BancoDetailComponent,
    resolve: {
      banco: BancoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.banco.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BancoUpdateComponent,
    resolve: {
      banco: BancoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.banco.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BancoUpdateComponent,
    resolve: {
      banco: BancoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.banco.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
