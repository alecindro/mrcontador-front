import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LOGIN_PAGE_ROUTE } from './login-page.route';
import { LoginPageComponent } from './login-page.component';
import { MrcontadorFrontSharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [MrcontadorFrontSharedModule, RouterModule.forChild([LOGIN_PAGE_ROUTE])],
  declarations: [LoginPageComponent],
})
export class LoginPageModule {}
