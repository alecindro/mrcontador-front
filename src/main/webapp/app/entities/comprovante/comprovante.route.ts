import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IComprovante, Comprovante } from 'app/shared/model/comprovante.model';
import { ComprovanteService } from './comprovante.service';
import { ComprovanteComponent } from './comprovante.component';
import { ComprovanteDetailComponent } from './comprovante-detail.component';
import { ComprovanteUpdateComponent } from './comprovante-update.component';

@Injectable({ providedIn: 'root' })
export class ComprovanteResolve implements Resolve<IComprovante> {
  constructor(private service: ComprovanteService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IComprovante> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((comprovante: HttpResponse<Comprovante>) => {
          if (comprovante.body) {
            return of(comprovante.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Comprovante());
  }
}

export const comprovanteRoute: Routes = [
  {
    path: '',
    component: ComprovanteComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'mrcontadorFrontApp.comprovante.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ComprovanteDetailComponent,
    resolve: {
      comprovante: ComprovanteResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.comprovante.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ComprovanteUpdateComponent,
    resolve: {
      comprovante: ComprovanteResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.comprovante.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ComprovanteUpdateComponent,
    resolve: {
      comprovante: ComprovanteResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.comprovante.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
