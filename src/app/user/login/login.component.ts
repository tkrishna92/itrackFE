import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/user.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService} from 'ngx-cookie-service'
import { Router } from '@angular/router';
import { SocketService } from 'src/socket.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: string;
  public password: string;

  constructor(private _http: UserService, private spinner : NgxSpinnerService, private socketService: SocketService , private toaster: ToastrService, private cookies: CookieService, private router: Router) { }

  ngOnInit() {


    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 2000)

    this.checkUserLogin();
    this.userLoggedIn();
    this.handleSocketError();

  }

  //handling "error-occurred" event
  public handleSocketError = (): any=>{
    this.socketService.socketError().subscribe(
      data=>{
        if(data.status == 500){

        }else{
          this.router.navigate(['dashboard']);
        }
      }
    )
  }

  // observable to check is user is logged in
  public checkUserLogin = (): any=>{
    let authToken = ""
    if(this.cookies.get('authToken').length>0){
      authToken = this.cookies.get('authToken')
    }else if(this._http.getUserDetails() != null){
      authToken =  this._http.getUserDetails()["authToken"];
    }else if(this._http.getUserDetails() == null){
      authToken = "";
    }
    this.socketService.checkAuthToken(authToken);
  }

  //handle "user-loggedin" event
  public userLoggedIn = (): any=>{
    this.socketService.verifyUserLoggedIn().subscribe(
      data=>{
        if(data == "loggedin"){
          this.router.navigate(['dashboard']);
        }
      }
    )
  }


  public goToSignup = (): any => {
    this.router.navigate(['signup']);
  }

  public loginFunction = (): any => {
    let data = {
      email: this.email,
      password: this.password
    }
    this._http.loginUser(data).subscribe(
      data => {
        if (data.status == "200") {
          this.toaster.success("login success");
          setTimeout(() => {
            this.cookies.set('authToken', data.data.authToken);
            this.cookies.set('userName', `${data.data.userDetails.firstName} ${data.data.userDetails.lastName}`);
            this.cookies.set('userId', data.data.userDetails.userId);            
            this._http.setUserDetails(data.data);
            this.router.navigate(['dashboard']);
          }, 1000)
        } else {
          this.toaster.warning(data.message);
        }
      }
    )
  }


}
