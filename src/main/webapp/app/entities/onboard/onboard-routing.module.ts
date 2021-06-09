import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExtratoDashComponent } from './extrato/extratodash.component';
import { Authority } from '../../shared/constants/authority.constants';
import { UserRouteAccessService } from '../../core/auth/user-route-access-service';
import { ContaDashComponent } from './conta/contadash.component';
import { NfeComponent } from './nfe/nfe.component';
import { OnboardComponent } from './onboard.component';
import { NsDashComponent } from './notaservico/nsdash.component';
import { AgenciaDashComponent } from './agencia/agenciadash.component';
import { CadDashComponent } from './cadastro/caddash.component';
import { AgenciaDashUpdateComponent } from './agencia/agenciadash-update.component';
import { ComprovanteComponent } from './comprovante/comprovante.component';
import { InteligentComponent } from './inteligent/inteligent.component';
import { RegraComponent } from './regra/regra.component';
import { CaixaComponent } from './caixa/caixa.component';
import { StatsComponent } from './stats/stats.component';

const routes: Routes = [
  {
    path: '',
    component: OnboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'stats',
        pathMatch: 'full',
      },
      {
        path: 'stats',
        component: StatsComponent,
        data: {
          authorities: [Authority.USER],
          defaultSort: 'id,asc',
          pageTitle: 'global.title',
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'consolida',
        component: InteligentComponent,
        data: {
          authorities: [Authority.USER],
          defaultSort: 'id,asc',
          pageTitle: 'global.title',
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'extrato',
        component: ExtratoDashComponent,
        data: {
          authorities: [Authority.USER],
          defaultSort: 'extDatalancamento,asc',
          pageTitle: 'global.title',
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'conta',
        component: ContaDashComponent,
        data: {
          authorities: [Authority.USER],
          defaultSort: 'id,asc',
          pageTitle: 'global.title',
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'nfe',
        component: NfeComponent,
        data: {
          authorities: [Authority.USER],
          defaultSort: 'notDataparcela,asc',
          pageTitle: 'global.title',
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'ns',
        component: NsDashComponent,
        data: {
          authorities: [Authority.USER],
          defaultSort: 'id,asc',
          pageTitle: 'global.title',
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'agencia',
        component: AgenciaDashComponent,
        data: {
          authorities: [Authority.USER],
          defaultSort: 'id,asc',
          pageTitle: 'global.title',
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'agenciaNew',
        component: AgenciaDashUpdateComponent,
        data: {
          authorities: [Authority.USER],
          defaultSort: 'id,asc',
          pageTitle: 'global.title',
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'cadastro',
        component: CadDashComponent,
        data: {
          authorities: [Authority.USER],
          defaultSort: 'id,asc',
          pageTitle: 'global.title',
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'comprovante',
        component: ComprovanteComponent,
        data: {
          authorities: [Authority.USER],
          defaultSort: 'comDatapagamento,asc',
          pageTitle: 'global.title',
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'regra',
        component: RegraComponent,
        data: {
          authorities: [Authority.USER],
          defaultSort: 'dataCadastro,desc',
          pageTitle: 'global.title',
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'caixa',
        component: CaixaComponent,
        data: {
          authorities: [Authority.USER],
          pageTitle: 'global.title',
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
