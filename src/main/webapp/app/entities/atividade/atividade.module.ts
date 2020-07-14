import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MrcontadorFrontSharedModule } from 'app/shared/shared.module';
import { AtividadeComponent } from './atividade.component';
import { AtividadeDetailComponent } from './atividade-detail.component';
import { AtividadeUpdateComponent } from './atividade-update.component';
import { AtividadeDeleteDialogComponent } from './atividade-delete-dialog.component';
import { atividadeRoute } from './atividade.route';

@NgModule({
  imports: [MrcontadorFrontSharedModule, RouterModule.forChild(atividadeRoute)],
  declarations: [AtividadeComponent, AtividadeDetailComponent, AtividadeUpdateComponent, AtividadeDeleteDialogComponent],
  entryComponents: [AtividadeDeleteDialogComponent],
})
export class MrcontadorFrontAtividadeModule {}
