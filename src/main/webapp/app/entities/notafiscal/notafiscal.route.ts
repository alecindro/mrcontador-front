import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { INotafiscal, Notafiscal } from 'app/shared/model/notafiscal.model';
import { NotafiscalService } from './notafiscal.service';
import { NotafiscalComponent } from './notafiscal.component';
import { NotafiscalDetailComponent } from './notafiscal-detail.component';
import { NotafiscalUpdateComponent } from './notafiscal-update.component';

@Injectable({ providedIn: 'root' })
export class NotafiscalResolve implements Resolve<INotafiscal> {
  constructor(private service: NotafiscalService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<INotafiscal> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((notafiscal: HttpResponse<Notafiscal>) => {
          if (notafiscal.body) {
            return of(notafiscal.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Notafiscal());
  }
}

export const notafiscalRoute: Routes = [
  {
    path: '',
    component: NotafiscalComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'mrcontadorFrontApp.notafiscal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: NotafiscalDetailComponent,
    resolve: {
      notafiscal: NotafiscalResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.notafiscal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: NotafiscalUpdateComponent,
    resolve: {
      notafiscal: NotafiscalResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.notafiscal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: NotafiscalUpdateComponent,
    resolve: {
      notafiscal: NotafiscalResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.notafiscal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
