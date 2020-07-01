import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MrcontadorFrontSharedModule } from 'app/shared/shared.module';
import { RegraComponent } from './regra.component';
import { RegraDetailComponent } from './regra-detail.component';
import { RegraUpdateComponent } from './regra-update.component';
import { RegraDeleteDialogComponent } from './regra-delete-dialog.component';
import { regraRoute } from './regra.route';

@NgModule({
  imports: [MrcontadorFrontSharedModule, RouterModule.forChild(regraRoute)],
  declarations: [RegraComponent, RegraDetailComponent, RegraUpdateComponent, RegraDeleteDialogComponent],
  entryComponents: [RegraDeleteDialogComponent],
})
export class MrcontadorFrontRegraModule {}
