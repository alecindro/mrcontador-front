import { NgModule } from '@angular/core';
import { MrcontadorFrontSharedLibsModule } from './shared-libs.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { AlertComponent } from './alert/alert.component';
import { AlertErrorComponent } from './alert/alert-error.component';
import { LoginModalComponent } from './login/login.component';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { FileComponent } from './file/file.component';

@NgModule({
  imports: [MrcontadorFrontSharedLibsModule],
  declarations: [
    FindLanguageFromKeyPipe,
    AlertComponent,
    AlertErrorComponent,
    LoginModalComponent,
    HasAnyAuthorityDirective,
    FileComponent,
  ],
  entryComponents: [LoginModalComponent],
  exports: [
    MrcontadorFrontSharedLibsModule,
    FindLanguageFromKeyPipe,
    AlertComponent,
    AlertErrorComponent,
    LoginModalComponent,
    HasAnyAuthorityDirective,
    FileComponent,
  ],
})
export class MrcontadorFrontSharedModule {}
