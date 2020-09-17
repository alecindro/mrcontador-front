import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { INotaservico, Notaservico } from 'app/shared/model/notaservico.model';
import { NotaservicoService } from './notaservico.service';
import { NotaservicoComponent } from './notaservico.component';
import { NotaservicoDetailComponent } from './notaservico-detail.component';
import { NotaservicoUpdateComponent } from './notaservico-update.component';

@Injectable({ providedIn: 'root' })
export class NotaservicoResolve implements Resolve<INotaservico> {
  constructor(private service: NotaservicoService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<INotaservico> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((notaservico: HttpResponse<Notaservico>) => {
          if (notaservico.body) {
            return of(notaservico.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Notaservico());
  }
}

export const notaservicoRoute: Routes = [
  {
    path: '',
    component: NotaservicoComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'mrcontadorFrontApp.notaservico.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: NotaservicoDetailComponent,
    resolve: {
      notaservico: NotaservicoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.notaservico.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: NotaservicoUpdateComponent,
    resolve: {
      notaservico: NotaservicoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.notaservico.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: NotaservicoUpdateComponent,
    resolve: {
      notaservico: NotaservicoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.notaservico.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
