import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardRoutingModule } from './onboard-routing.module';
import { ContaDashComponent } from './conta/contadash.component';
import { ExtratoDashComponent } from './extrato/extratodash.component';
import { NfeComponent } from './nfe/nfe.component';
import { ConsolidaComponent } from './consolida/consolida.component';
import { MrcontadorFrontExtratoModule } from '../extrato/extrato.module';
import { MrcontadorFrontNotafiscalModule } from '../notafiscal/notafiscal.module';
import { MrcontadorFrontNotaservicoModule } from '../notaservico/notaservico.module';
import { AgenciaDashComponent } from './agencia/agenciadash.component';
import { NsDashComponent } from './notaservico/nsdash.component';
import { CadDashComponent } from './cadastro/caddash.component';
import { MrcontadorFrontSharedModule } from 'app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { AgenciaDashUpdateComponent } from './agencia/agenciadash-update.component';

@NgModule({
  declarations: [
    ContaDashComponent,
    ExtratoDashComponent,
    NfeComponent,
    ConsolidaComponent,
    AgenciaDashComponent,
    AgenciaDashUpdateComponent,
    NsDashComponent,
    CadDashComponent,
  ],
  imports: [
    CommonModule,
    OnboardRoutingModule,
    MrcontadorFrontExtratoModule,
    MrcontadorFrontNotafiscalModule,
    MrcontadorFrontNotaservicoModule,
    MrcontadorFrontSharedModule,
    NgxMaskModule.forChild(),
    NgbTypeaheadModule,
  ],
})
export class OnboardModule {}
