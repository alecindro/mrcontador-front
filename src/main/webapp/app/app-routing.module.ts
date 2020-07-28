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
          path: 'parceiro',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./entities/parceiro/parceiro.module').then(m => m.MrcontadorFrontParceiroModule),
        },
        {
          path: 'comprovante',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./entities/comprovante/comprovante.module').then(m => m.MrcontadorFrontComprovanteModule),
        },
        {
          path: 'conta',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./entities/conta/conta.module').then(m => m.MrcontadorFrontContaModule),
        },
        {
          path: 'notafiscal',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./entities/notafiscal/notafiscal.module').then(m => m.MrcontadorFrontNotafiscalModule),
        },
        {
          path: 'agenciabancaria',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./entities/agenciabancaria/agenciabancaria.module').then(m => m.MrcontadorFrontAgenciabancariaModule),
        },
        {
          path: 'notaservico',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./entities/notaservico/notaservico.module').then(m => m.MrcontadorFrontNotaservicoModule),
        },
        {
          path: 'regra',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./entities/regra/regra.module').then(m => m.MrcontadorFrontRegraModule),
        },
        {
          path: 'extrato',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./entities/extrato/extrato.module').then(m => m.MrcontadorFrontExtratoModule),
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
