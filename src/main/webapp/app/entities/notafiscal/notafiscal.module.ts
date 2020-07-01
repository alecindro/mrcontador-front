import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MrcontadorFrontSharedModule } from 'app/shared/shared.module';
import { NotafiscalComponent } from './notafiscal.component';
import { NotafiscalDetailComponent } from './notafiscal-detail.component';
import { NotafiscalUpdateComponent } from './notafiscal-update.component';
import { NotafiscalDeleteDialogComponent } from './notafiscal-delete-dialog.component';
import { notafiscalRoute } from './notafiscal.route';

@NgModule({
  imports: [MrcontadorFrontSharedModule, RouterModule.forChild(notafiscalRoute)],
  declarations: [NotafiscalComponent, NotafiscalDetailComponent, NotafiscalUpdateComponent, NotafiscalDeleteDialogComponent],
  entryComponents: [NotafiscalDeleteDialogComponent],
})
export class MrcontadorFrontNotafiscalModule {}
