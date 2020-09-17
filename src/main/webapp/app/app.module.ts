import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import './vendor';
import { MrcontadorFrontSharedModule } from 'app/shared/shared.module';
import { MrcontadorFrontCoreModule } from 'app/core/core.module';
import { MrcontadorFrontAppRoutingModule } from './app-routing.module';
import { MrcontadorFrontHomeModule } from './home/home.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ActiveMenuDirective } from './layouts/navbar/active-menu.directive';
import { ErrorComponent } from './layouts/error/error.component';
import { LoginPageModule } from './login/login-page.module';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';
import { registerLocaleData } from '@angular/common';
import localeBr from '@angular/common/locales/pt';
import { OnboardComponent } from './entities/onboard/onboard.component';
import { DisableFormDirective } from './disable-form.directive';

const maskConfig: Partial<IConfig> = {
  validation: true,
};

registerLocaleData(localeBr, 'pt');
@NgModule({
  imports: [
    BrowserModule,
    MrcontadorFrontSharedModule,
    MrcontadorFrontCoreModule,
    MrcontadorFrontHomeModule,
    LoginPageModule,
    NgxMaskModule.forRoot(maskConfig),
    NgxSpinnerModule,
    BrowserAnimationsModule,
    MrcontadorFrontAppRoutingModule,

    // jhipster-needle-angular-add-module JHipster will add new module here
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    MainComponent,
    NavbarComponent,
    ErrorComponent,
    PageRibbonComponent,
    ActiveMenuDirective,
    FooterComponent,
    OnboardComponent,
    DisableFormDirective,
  ],
  bootstrap: [MainComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'pt' }],
})
export class MrcontadorFrontAppModule {}
