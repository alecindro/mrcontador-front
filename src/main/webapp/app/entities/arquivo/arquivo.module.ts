import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MrcontadorFrontSharedModule } from 'app/shared/shared.module';
import { ArquivoComponent } from './arquivo.component';
import { ArquivoDetailComponent } from './arquivo-detail.component';
import { ArquivoUpdateComponent } from './arquivo-update.component';
import { ArquivoDeleteDialogComponent } from './arquivo-delete-dialog.component';
import { arquivoRoute } from './arquivo.route';

@NgModule({
  imports: [MrcontadorFrontSharedModule, RouterModule.forChild(arquivoRoute)],
  declarations: [ArquivoComponent, ArquivoDetailComponent, ArquivoUpdateComponent, ArquivoDeleteDialogComponent],
  entryComponents: [ArquivoDeleteDialogComponent],
})
export class MrcontadorFrontArquivoModule {}