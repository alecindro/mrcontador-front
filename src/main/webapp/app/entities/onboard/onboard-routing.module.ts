import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExtratoDashComponent } from './extrato/extratodash.component';
import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ContaDashComponent } from './conta/contadash.component';
import { NfeComponent } from './nfe/nfe.component';
import { OnboardComponent } from './onboard.component';
import { NsDashComponent } from './notaservico/nsdash.component';
import { AgenciaDashComponent } from './agencia/agenciadash.component';
import { CadDashComponent } from './cadastro/caddash.component';
import { ParceiroResolve } from '../parceiro/parceiro.route';
import { AgenciaDashUpdateComponent } from './agencia/agenciadash-update.component';
import { ComprovanteComponent } from './comprovante/comprovante.component';
import { InteligentComponent } from './inteligent/inteligent.component';
import { RegraComponent } from './regra/regra.component';

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
        component: InteligentComponent,
        data: {
          authorities: [Authority.USER],
          defaultSort: 'id,asc',
          pageTitle: 'mrcontadorFrontApp.inteligent.home.title',
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'extrato',
        component: ExtratoDashComponent,
        data: {
          authorities: [Authority.USER],
          defaultSort: 'extDatalancamento,desc',
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
          defaultSort: 'notDatasaida,desc',
          pageTitle: 'mrcontadorFrontApp.notafiscal.home.title',
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
          pageTitle: 'mrcontadorFrontApp.agenciabancaria.home.title',
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'agenciaNew',
        component: AgenciaDashUpdateComponent,
        data: {
          authorities: [Authority.USER],
          defaultSort: 'id,asc',
          pageTitle: 'mrcontadorFrontApp.agenciabancaria.home.title',
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'cadastro',
        component: CadDashComponent,
        data: {
          authorities: [Authority.USER],
          defaultSort: 'id,asc',
          pageTitle: 'mrcontadorFrontApp.parceiro.home.createOrEditLabel',
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'comprovante',
        component: ComprovanteComponent,
        data: {
          authorities: [Authority.USER],
          defaultSort: 'comDatapagamento,asc',
          pageTitle: 'mrcontadorFrontApp.comprovante.home.title',
        },
        canActivate: [UserRouteAccessService],
      },
      {
        path: 'regra',
        component: RegraComponent,
        data: {
          authorities: [Authority.USER],
          defaultSort: 'par_codigo,asc',
          pageTitle: 'mrcontadorFrontApp.regra.home.title',
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
