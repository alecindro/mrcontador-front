import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MrcontadorFrontSharedModule } from 'app/shared/shared.module';
import { SocioComponent } from './socio.component';
import { SocioDetailComponent } from './socio-detail.component';
import { SocioUpdateComponent } from './socio-update.component';
import { SocioDeleteDialogComponent } from './socio-delete-dialog.component';
import { socioRoute } from './socio.route';

@NgModule({
  imports: [MrcontadorFrontSharedModule, RouterModule.forChild(socioRoute)],
  declarations: [SocioComponent, SocioDetailComponent, SocioUpdateComponent, SocioDeleteDialogComponent],
  entryComponents: [SocioDeleteDialogComponent],
})
export class MrcontadorFrontSocioModule {}
