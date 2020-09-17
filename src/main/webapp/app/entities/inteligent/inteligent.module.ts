import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MrcontadorFrontSharedModule } from 'app/shared/shared.module';
import { InteligentComponent } from './inteligent.component';
import { InteligentDetailComponent } from './inteligent-detail.component';
import { inteligentRoute } from './inteligent.route';

@NgModule({
  imports: [MrcontadorFrontSharedModule, RouterModule.forChild(inteligentRoute)],
  declarations: [InteligentComponent, InteligentDetailComponent],
})
export class MrcontadorFrontInteligentModule {}
