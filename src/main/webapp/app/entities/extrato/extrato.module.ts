import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MrcontadorFrontSharedModule } from 'app/shared/shared.module';
import { ExtratoComponent } from './extrato.component';
import { ExtratoDetailComponent } from './extrato-detail.component';
import { ExtratoUpdateComponent } from './extrato-update.component';
import { ExtratoDeleteDialogComponent } from './extrato-delete-dialog.component';
import { extratoRoute } from './extrato.route';

@NgModule({
  imports: [MrcontadorFrontSharedModule, RouterModule.forChild(extratoRoute)],
  declarations: [ExtratoComponent, ExtratoDetailComponent, ExtratoUpdateComponent, ExtratoDeleteDialogComponent],
  entryComponents: [ExtratoDeleteDialogComponent],
  exports: [ExtratoComponent],
})
export class MrcontadorFrontExtratoModule {}
