import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/user.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgotpw',
  templateUrl: './forgotpw.component.html',
  styleUrls: ['./forgotpw.component.css']
})
export class ForgotpwComponent implements OnInit {

  public countryList: any = [];
  public countryPhoneCode: string;
  public email: string;
  public mobileNumber: string;
  public twoMinuteToken: boolean = false;
  public countryName : string;

  constructor(private _http: UserService, private router: Router, private cookies: CookieService, private toaster: ToastrService) { }

  ngOnInit() {
    this.getCountryList();
  } 

  public goToSignin = (): any => {
    this.router.navigate(['login']);
  }

  public getCountryList = (): any => {
    this._http.getCountryList().subscribe(
      data => {
        this.countryList = [];
        for (let x of data.data) {
          this.countryList.push(x);
        }
      }
    )
  }

  public getCountryCode = (country): any => {
    this._http.getPhoneCode(country).subscribe(
      data => {
        this.countryPhoneCode = `+${data.data}`
        console.log(this.countryPhoneCode);
      }
    )
  }

  public forgotPassword = (): any => {
    let data = {
      email: this.email,
      mobileNumber: this.mobileNumber
    }
    this._http.forgotPassword(data).subscribe(
      data => {
        if (data.status == 200) {
          this.toaster.success("edit password link valid for 2 minutes", data.message, { timeOut: 3000 });
          setTimeout(() => {
            this.cookies.set('authToken', data.data.authToken);
            this.cookies.set('email', data.data.userDetails.email)
            this._http.setUserDetails(data.data);
            this.twoMinuteToken = true;
          }, 1000);
        } else {
          this.toaster.warning(data.message);
        }
      }
    )
  }
}
