import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MrcontadorFrontSharedModule } from 'app/shared/shared.module';
import { ParceiroComponent } from './parceiro.component';
import { ParceiroDetailComponent } from './parceiro-detail.component';
import { ParceiroUpdateComponent } from './parceiro-update.component';
import { ParceiroDeleteDialogComponent } from './parceiro-delete-dialog.component';
import { parceiroRoute } from './parceiro.route';
import { NgxMaskModule } from 'ngx-mask';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [MrcontadorFrontSharedModule, RouterModule.forChild(parceiroRoute), NgxMaskModule.forChild(), NgbButtonsModule],
  declarations: [ParceiroComponent, ParceiroDetailComponent, ParceiroUpdateComponent, ParceiroDeleteDialogComponent],
  entryComponents: [ParceiroDeleteDialogComponent],
})
export class MrcontadorFrontParceiroModule {}
