import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MrcontadorFrontSharedModule } from 'app/shared/shared.module';
import { ArquivoerroComponent } from './arquivoerro.component';
import { ArquivoerroDetailComponent } from './arquivoerro-detail.component';
import { ArquivoerroUpdateComponent } from './arquivoerro-update.component';
import { ArquivoerroDeleteDialogComponent } from './arquivoerro-delete-dialog.component';
import { arquivoerroRoute } from './arquivoerro.route';

@NgModule({
  imports: [MrcontadorFrontSharedModule, RouterModule.forChild(arquivoerroRoute)],
  declarations: [ArquivoerroComponent, ArquivoerroDetailComponent, ArquivoerroUpdateComponent, ArquivoerroDeleteDialogComponent],
  entryComponents: [ArquivoerroDeleteDialogComponent],
})
export class MrcontadorFrontArquivoerroModule {}
