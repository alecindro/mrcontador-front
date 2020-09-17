import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MrcontadorFrontSharedModule } from 'app/shared/shared.module';
import { BancoComponent } from './banco.component';
import { BancoDetailComponent } from './banco-detail.component';
import { BancoUpdateComponent } from './banco-update.component';
import { BancoDeleteDialogComponent } from './banco-delete-dialog.component';
import { bancoRoute } from './banco.route';

@NgModule({
  imports: [MrcontadorFrontSharedModule, RouterModule.forChild(bancoRoute)],
  declarations: [BancoComponent, BancoDetailComponent, BancoUpdateComponent, BancoDeleteDialogComponent],
  entryComponents: [BancoDeleteDialogComponent],
})
export class MrcontadorFrontBancoModule {}
