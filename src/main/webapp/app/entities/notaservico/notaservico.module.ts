import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MrcontadorFrontSharedModule } from 'app/shared/shared.module';
import { NotaservicoComponent } from './notaservico.component';
import { NotaservicoDetailComponent } from './notaservico-detail.component';
import { NotaservicoUpdateComponent } from './notaservico-update.component';
import { NotaservicoDeleteDialogComponent } from './notaservico-delete-dialog.component';
import { notaservicoRoute } from './notaservico.route';

@NgModule({
  imports: [MrcontadorFrontSharedModule, RouterModule.forChild(notaservicoRoute)],
  declarations: [NotaservicoComponent, NotaservicoDetailComponent, NotaservicoUpdateComponent, NotaservicoDeleteDialogComponent],
  entryComponents: [NotaservicoDeleteDialogComponent],
  exports: [NotaservicoComponent],
})
export class MrcontadorFrontNotaservicoModule {}
