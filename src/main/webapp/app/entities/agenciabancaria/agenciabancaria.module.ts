import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MrcontadorFrontSharedModule } from 'app/shared/shared.module';
import { AgenciabancariaComponent } from './agenciabancaria.component';
import { AgenciabancariaDetailComponent } from './agenciabancaria-detail.component';
import { AgenciabancariaUpdateComponent } from './agenciabancaria-update.component';
import { AgenciabancariaDeleteDialogComponent } from './agenciabancaria-delete-dialog.component';
import { agenciabancariaRoute } from './agenciabancaria.route';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [MrcontadorFrontSharedModule, RouterModule.forChild(agenciabancariaRoute), NgbTypeaheadModule],
  declarations: [
    AgenciabancariaComponent,
    AgenciabancariaDetailComponent,
    AgenciabancariaUpdateComponent,
    AgenciabancariaDeleteDialogComponent,
  ],
  entryComponents: [AgenciabancariaDeleteDialogComponent],
  exports: [AgenciabancariaComponent],
})
export class MrcontadorFrontAgenciabancariaModule {}
