import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MrcontadorFrontSharedModule } from 'app/shared/shared.module';
import { ContadorComponent } from './contador.component';
import { ContadorDetailComponent } from './contador-detail.component';
import { ContadorUpdateComponent } from './contador-update.component';
import { ContadorDeleteDialogComponent } from './contador-delete-dialog.component';
import { contadorRoute } from './contador.route';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  imports: [MrcontadorFrontSharedModule, RouterModule.forChild(contadorRoute), NgxMaskModule.forChild()],
  declarations: [ContadorComponent, ContadorDetailComponent, ContadorUpdateComponent, ContadorDeleteDialogComponent],
  entryComponents: [ContadorDeleteDialogComponent],
})
export class MrcontadorFrontContadorModule {}
