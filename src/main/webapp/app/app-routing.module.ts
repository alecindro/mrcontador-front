import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/shared/constants/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';

const LAYOUT_ROUTES = [navbarRoute, ...errorRoute];

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN, Authority.MRCONTADOR_MASTER],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'contador',
          data: {
            authorities: [Authority.MRCONTADOR_MASTER],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./entities/contador/contador.module').then(m => m.MrcontadorFrontContadorModule),
        },
        {
          path: 'banco',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./entities/banco/banco.module').then(m => m.MrcontadorFrontBancoModule),
        },
        {
          path: '',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./entities/parceiro/parceiro.module').then(m => m.MrcontadorFrontParceiroModule),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },
        {
          path: 'onboard',
          loadChildren: () => import('./entities/onboard/onboard.module').then(m => m.OnboardModule),
        },

        ...LAYOUT_ROUTES,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class MrcontadorFrontAppRoutingModule {}
