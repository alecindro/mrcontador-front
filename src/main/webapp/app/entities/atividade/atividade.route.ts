import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IAtividade, Atividade } from 'app/model/atividade.model';
import { AtividadeService } from '../../services/atividade.service';
import { AtividadeComponent } from './atividade.component';
import { AtividadeDetailComponent } from './atividade-detail.component';
import { AtividadeUpdateComponent } from './atividade-update.component';

@Injectable({ providedIn: 'root' })
export class AtividadeResolve implements Resolve<IAtividade> {
  constructor(private service: AtividadeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAtividade> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((atividade: HttpResponse<Atividade>) => {
          if (atividade.body) {
            return of(atividade.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Atividade());
  }
}

export const atividadeRoute: Routes = [
  {
    path: '',
    component: AtividadeComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'mrcontadorFrontApp.atividade.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AtividadeDetailComponent,
    resolve: {
      atividade: AtividadeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.atividade.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AtividadeUpdateComponent,
    resolve: {
      atividade: AtividadeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.atividade.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AtividadeUpdateComponent,
    resolve: {
      atividade: AtividadeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.atividade.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
