import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MrcontadorFrontSharedModule } from 'app/shared/shared.module';
import { ContaComponent } from './conta.component';
import { ContaDetailComponent } from './conta-detail.component';
import { ContaUpdateComponent } from './conta-update.component';
import { ContaDeleteDialogComponent } from './conta-delete-dialog.component';
import { contaRoute } from './conta.route';

@NgModule({
  imports: [MrcontadorFrontSharedModule, RouterModule.forChild(contaRoute)],
  declarations: [ContaComponent, ContaDetailComponent, ContaUpdateComponent, ContaDeleteDialogComponent],
  entryComponents: [ContaDeleteDialogComponent],
  exports: [ContaComponent],
})
export class MrcontadorFrontContaModule {}
