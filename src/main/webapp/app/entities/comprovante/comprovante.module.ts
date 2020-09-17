import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MrcontadorFrontSharedModule } from 'app/shared/shared.module';
import { ComprovanteComponent } from './comprovante.component';
import { ComprovanteDetailComponent } from './comprovante-detail.component';
import { ComprovanteUpdateComponent } from './comprovante-update.component';
import { ComprovanteDeleteDialogComponent } from './comprovante-delete-dialog.component';
import { comprovanteRoute } from './comprovante.route';

@NgModule({
  imports: [MrcontadorFrontSharedModule, RouterModule.forChild(comprovanteRoute)],
  declarations: [ComprovanteComponent, ComprovanteDetailComponent, ComprovanteUpdateComponent, ComprovanteDeleteDialogComponent],
  entryComponents: [ComprovanteDeleteDialogComponent],
})
export class MrcontadorFrontComprovanteModule {}
