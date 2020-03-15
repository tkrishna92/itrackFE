import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/user.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editpw',
  templateUrl: './editpw.component.html',
  styleUrls: ['./editpw.component.css']
})
export class EditpwComponent implements OnInit {

  public password: string;
  public email: string;
  public authToken : string;

  constructor(private _http: UserService, private toaster: ToastrService, private cookies: CookieService, private router: Router) { }

  ngOnInit() {
    this.email = (this.cookies.get('email').length>0)?this.cookies.get('email'):this._http.getUserDetails()["userDetails"]["email"];
    this.authToken = (this.cookies.get('authToken').length>0)?this.cookies.get('authToken'):this._http.getUserDetails()["authToken"];
    console.log(this.email);
  }

  public editPassword = () => {

    let data = {
      password: this.password
    }
    this._http.editPassword(data).subscribe(
      data => {
        if (data.status == 200) {
          this.toaster.success(data.message);
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 1000);
        } else {
          this.toaster.warning(data.message);
        }
      }
    )
  }
}
