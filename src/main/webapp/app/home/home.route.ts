import { Route } from '@angular/router';

import { HomeComponent } from './home.component';
import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';

export const HOME_ROUTE: Route = {
  path: '',
  component: HomeComponent,
  data: {
    authorities: [Authority.USER, Authority.ADMIN],
    pageTitle: 'home.title',
  },
  canActivate: [UserRouteAccessService],
};
