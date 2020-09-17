import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IInteligent, Inteligent } from 'app/shared/model/inteligent.model';
import { InteligentService } from './inteligent.service';
import { InteligentComponent } from './inteligent.component';
import { InteligentDetailComponent } from './inteligent-detail.component';

@Injectable({ providedIn: 'root' })
export class InteligentResolve implements Resolve<IInteligent> {
  constructor(private service: InteligentService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IInteligent> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((inteligent: HttpResponse<Inteligent>) => {
          if (inteligent.body) {
            return of(inteligent.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Inteligent());
  }
}

export const inteligentRoute: Routes = [
  {
    path: '',
    component: InteligentComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'mrcontadorFrontApp.inteligent.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InteligentDetailComponent,
    resolve: {
      inteligent: InteligentResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'mrcontadorFrontApp.inteligent.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
