import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MrcontadorFrontSharedModule } from 'app/shared/shared.module';

import { DocsComponent } from './docs.component';

import { docsRoute } from './docs.route';

@NgModule({
  imports: [MrcontadorFrontSharedModule, RouterModule.forChild([docsRoute])],
  declarations: [DocsComponent],
})
export class DocsModule {}
