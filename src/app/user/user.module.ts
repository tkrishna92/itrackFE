import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//angular modules
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


//external modules
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';


//added components and services for this module
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotpwComponent } from './forgotpw/forgotpw.component';
import { EditpwComponent } from './editpw/editpw.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent, ForgotpwComponent, EditpwComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
      { path : 'signup', component : SignupComponent },
      { path : 'login', component : LoginComponent },
      { path : 'forgotpw', component : ForgotpwComponent},
      { path : 'editpw', component : EditpwComponent}
    ])
  ]
})
export class UserModule { }
