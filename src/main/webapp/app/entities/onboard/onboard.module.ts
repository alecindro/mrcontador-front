import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardRoutingModule } from './onboard-routing.module';
import { ContaDashComponent } from './conta/contadash.component';
import { ExtratoDashComponent } from './extrato/extratodash.component';
import { NfeComponent } from './nfe/nfe.component';
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
import { NfeUploadComponent } from './nfe/nfe-upload.component';
import { ExtratoUploadComponent } from './extrato/extrato-upload.component';
import { NsUploadComponent } from './notaservico/ns-upload.component';
import { ComprovanteComponent } from './comprovante/comprovante.component';
import { ComprovanteUploadComponent } from './comprovante/comprovante-upload.component';
import { InteligentComponent } from './inteligent/inteligent.component';

@NgModule({
  declarations: [
    ContaDashComponent,
    ExtratoDashComponent,
    NfeComponent,
    InteligentComponent,
    AgenciaDashComponent,
    AgenciaDashUpdateComponent,
    NsDashComponent,
    CadDashComponent,
    NfeUploadComponent,
    ExtratoUploadComponent,
    NsUploadComponent,
    ComprovanteComponent,
    ComprovanteUploadComponent,
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
  entryComponents: [NfeUploadComponent, ExtratoUploadComponent, NsUploadComponent, ComprovanteUploadComponent],
})
export class OnboardModule {}
