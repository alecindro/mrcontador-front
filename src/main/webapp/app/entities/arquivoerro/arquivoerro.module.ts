import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MrcontadorFrontSharedModule } from 'app/shared/shared.module';
import { ArquivoerroComponent } from './arquivoerro.component';
import { ArquivoerroDeleteDialogComponent } from './arquivoerro-delete-dialog.component';
import { arquivoerroRoute } from './arquivoerro.route';
import { ArquivoerroProcessDialogComponent } from './arquivoerro-process-dialog.component';

@NgModule({
  imports: [MrcontadorFrontSharedModule, RouterModule.forChild(arquivoerroRoute)],
  declarations: [ArquivoerroComponent, ArquivoerroDeleteDialogComponent, ArquivoerroProcessDialogComponent],
  entryComponents: [ArquivoerroDeleteDialogComponent, ArquivoerroProcessDialogComponent],
})
export class MrcontadorFrontArquivoerroModule {}
