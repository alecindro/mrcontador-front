import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardRoutingModule } from './onboard-routing.module';
import { ContaDashComponent } from './conta/contadash.component';
import { ExtratoDashComponent } from './extrato/extratodash.component';
import { NfeComponent } from './nfe/nfe.component';
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
import { RegraComponent } from './regra/regra.component';
import { RegraUpdateComponent } from './regra/regra-update.component';
import { AgenciabancariaDeleteDialogComponent } from './agencia/agenciabancaria-delete-dialog.component';
import { FileUploadModule } from 'primeng/fileupload';
import { RegraDeleteDialogComponent } from './regra/regra-delete-dialog.component';
import { CaixaComponent } from './caixa/caixa.component';
import { CadDashDialogComponent } from './cadastro/caddash-diaolog.component';

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
    CadDashDialogComponent,
    NfeUploadComponent,
    ExtratoUploadComponent,
    NsUploadComponent,
    ComprovanteComponent,
    ComprovanteUploadComponent,
    RegraComponent,
    RegraUpdateComponent,
    RegraDeleteDialogComponent,
    AgenciabancariaDeleteDialogComponent,
    CaixaComponent,
  ],
  imports: [
    CommonModule,
    OnboardRoutingModule,
    MrcontadorFrontSharedModule,
    NgxMaskModule.forChild(),
    NgbTypeaheadModule,
    FileUploadModule,
  ],
  entryComponents: [
    NfeUploadComponent,
    ExtratoUploadComponent,
    NsUploadComponent,
    ComprovanteUploadComponent,
    RegraUpdateComponent,
    RegraDeleteDialogComponent,
    AgenciabancariaDeleteDialogComponent,
    CadDashDialogComponent,
  ],
})
export class OnboardModule {}
