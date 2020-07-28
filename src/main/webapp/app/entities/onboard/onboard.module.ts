import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardRoutingModule } from './onboard-routing.module';
import { ContaDashComponent } from './conta/contadash.component';
import { ExtratoDashComponent } from './extrato/extratodash.component';
import { NfeComponent } from './nfe/nfe.component';
import { ConsolidaComponent } from './consolida/consolida.component';
import { MrcontadorFrontContaModule } from '../conta/conta.module';
import { MrcontadorFrontExtratoModule } from '../extrato/extrato.module';
import { MrcontadorFrontAgenciabancariaModule } from '../agenciabancaria/agenciabancaria.module';
import { MrcontadorFrontNotafiscalModule } from '../notafiscal/notafiscal.module';
import { MrcontadorFrontNotaservicoModule } from '../notaservico/notaservico.module';
import { AgenciaDashComponent } from './agencia/agenciadash.component';
import { NsDashComponent } from './notaservico/nsdash.component';
import { CadDashComponent } from './cadastro/caddash.component';
import { MrcontadorFrontParceiroModule } from '../parceiro/parceiro.module';
import { MrcontadorFrontSharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [
    ContaDashComponent,
    ExtratoDashComponent,
    NfeComponent,
    ConsolidaComponent,
    AgenciaDashComponent,
    NsDashComponent,
    CadDashComponent,
  ],
  imports: [
    CommonModule,
    OnboardRoutingModule,
    MrcontadorFrontContaModule,
    MrcontadorFrontExtratoModule,
    MrcontadorFrontAgenciabancariaModule,
    MrcontadorFrontNotafiscalModule,
    MrcontadorFrontNotaservicoModule,
    MrcontadorFrontParceiroModule,
    MrcontadorFrontSharedModule,
  ],
})
export class OnboardModule {}
