import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExtratoDashComponent } from './extrato/extratodash.component';
import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ContaDashComponent } from './conta/contadash.component';
import { NfeComponent } from './nfe/nfe.component';
import { ConsolidaComponent } from './consolida/consolida.component';
import { OnboardComponent } from './onboard.component';
import { NsDashComponent } from './notaservico/nsdash.component';
import { AgenciaDashComponent } from './agencia/agenciadash.component';
import { CadDashComponent } from './cadastro/caddash.component';
import { ParceiroResolve } from '../parceiro/parceiro.route';

const routes: Routes = [
  {
    path: ':id',
    component: OnboardComponent,
    resolve: {
      parceiro: ParceiroResolve,
    },
    children: [
      {
        path: '',
        redirectTo: 'consolida',
        pathMatch: 'full',
      },
      {
        path: 'consolida',
        component: ConsolidaComponent,
        data: {
          authorities: [Authority.USER],
          defaultSort: 'id,asc',
          pageTitle: 'mrcontadorFrontApp.extrato.home.title',
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'extrato',
        component: ExtratoDashComponent,
        data: {
          authorities: [Authority.USER],
          defaultSort: 'id,asc',
          pageTitle: 'mrcontadorFrontApp.extrato.home.title',
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'conta',
        component: ContaDashComponent,
        data: {
          authorities: [Authority.USER],
          defaultSort: 'id,asc',
          pageTitle: 'mrcontadorFrontApp.conta.home.title',
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'nfe',
        component: NfeComponent,
        data: {
          authorities: [Authority.USER],
          defaultSort: 'id,asc',
          pageTitle: 'mrcontadorFrontApp.nota.home.title',
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'ns',
        component: NsDashComponent,
        data: {
          authorities: [Authority.USER],
          defaultSort: 'id,asc',
          pageTitle: 'mrcontadorFrontApp.notaservico.home.title',
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'agencia',
        component: AgenciaDashComponent,
        data: {
          authorities: [Authority.USER],
          defaultSort: 'id,asc',
          pageTitle: 'mrcontadorFrontApp.agencia.home.title',
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'cadastro',
        component: CadDashComponent,
        data: {
          authorities: [Authority.USER],
          defaultSort: 'id,asc',
          pageTitle: 'mrcontadorFrontApp.cadparceiro.home.title',
        },
        canActivate: [UserRouteAccessService],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnboardRoutingModule {}
