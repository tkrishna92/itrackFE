import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


//importing angular modules
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//importing external modules and services
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from "ngx-toastr";
import { CookieService } from "ngx-cookie-service";

//app components, modules and services
import { UserModule } from './user/user.module';
import { LoginComponent } from './user/login/login.component';
import { UserService } from 'src/user.service';
import { DashboardService } from 'src/dashboard.service';
import { DashboardModule } from './dashboard/dashboard.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    UserModule,
    DashboardModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      { path : 'login', component : LoginComponent, pathMatch : 'full'},
      { path : '', redirectTo : 'login', pathMatch : 'full'},
      { path : '*', component : LoginComponent},
      { path : '**', component : LoginComponent}
    ])
  ],
  providers: [HttpClientModule, CookieService, UserService, DashboardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
