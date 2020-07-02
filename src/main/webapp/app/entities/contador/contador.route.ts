import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IContador, Contador } from 'app/shared/model/contador.model';
import { ContadorService } from './contador.service';
import { ContadorComponent } from './contador.component';
import { ContadorDetailComponent } from './contador-detail.component';
import { ContadorUpdateComponent } from './contador-update.component';

@Injectable({ providedIn: 'root' })
export class ContadorResolve implements Resolve<IContador> {
  constructor(private service: ContadorService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IContador> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((contador: HttpResponse<Contador>) => {
          if (contador.body) {
            return of(contador.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Contador());
  }
}

export const contadorRoute: Routes = [
  {
    path: '',
    component: ContadorComponent,
    data: {
      authorities: [Authority.MRCONTADOR_MASTER],
      defaultSort: 'id,asc',
      pageTitle: 'mrcontadorFrontApp.contador.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ContadorDetailComponent,
    resolve: {
      contador: ContadorResolve,
    },
    data: {
      authorities: [Authority.MRCONTADOR_MASTER],
      pageTitle: 'mrcontadorFrontApp.contador.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ContadorUpdateComponent,
    resolve: {
      contador: ContadorResolve,
    },
    data: {
      authorities: [Authority.MRCONTADOR_MASTER],
      pageTitle: 'mrcontadorFrontApp.contador.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ContadorUpdateComponent,
    resolve: {
      contador: ContadorResolve,
    },
    data: {
      authorities: [Authority.MRCONTADOR_MASTER],
      pageTitle: 'mrcontadorFrontApp.contador.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
