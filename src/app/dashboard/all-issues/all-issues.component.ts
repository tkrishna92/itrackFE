import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DashboardService } from 'src/dashboard.service';
import { UserService } from 'src/user.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-all-issues',
  templateUrl: './all-issues.component.html',
  styleUrls: ['./all-issues.component.css']
})
export class AllIssuesComponent implements OnInit {

  @ViewChild('scrollMe', { read: ElementRef, static: true })
  public scrollMe: ElementRef;

  public assignIcon : string = "assets/icons/assigned.png"
  public watchingIcon : string = "assets/icons/watching.png"
  public reportedIcon : string = "assets/icons/reported.png"
  public allIssuesIcon : string = "assets/icons/allIssues.png"

  public authToken : string;
  public userName : string;
  public userId : string;
  public sideNavSwitch : boolean;
  public assignedIssuesSelected : boolean;
  public watchingIssuesSelected : boolean;
  public reportedIssuesSelected : boolean;
  public allIssuesSelected : boolean;
  public assignedNewIssues:any[] = [];
  public assignedBacklogIssues:any[] = [];
  public assignedInProgressIssues : any[] = [];
  public assignedDoneIssues : any[] = [];

  constructor(private dashboard: DashboardService, private userService : UserService, private cookies : CookieService, private toaster : ToastrService, private spinner : NgxSpinnerService ) { }

  ngOnInit(): void {

    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 2500)




    this.authToken = this.cookies.get('authToken');
    this.userName = this.cookies.get('userName');
    this.userId = this.cookies.get('userId');
    this.sideNavSwitch = true;
    this.assignedIssuesSelected = true;
    this.watchingIssuesSelected = false;
    this.reportedIssuesSelected = false;
    this.allIssuesSelected = false;

    this.getAssignedIssues("new");
  }

  //-----------------------------------------------------------------
  //--------------------------------Http calls-----------------------
  //-----------------------------------------------------------------

  public getAssignedIssues = (filter, skip?)=>{
    let data = {
      filter : filter,
      skip : skip*10
    }
    console.log(data);
    this.dashboard.getAssignedIssues(data).subscribe(
      data=>{
        this.assignedIssuesSelected= true;
        if(filter == "new"){
          this.assignedNewIssues = data.data;
          this.assignedBacklogIssues = [];
          this.assignedInProgressIssues = [];
          this.assignedDoneIssues = [];
          // this.toaster.info("showing new issues assigned to you");
        }else if(filter == "backlog"){
          this.assignedNewIssues = [];
          this.assignedBacklogIssues = data.data;
          this.assignedInProgressIssues = [];
          this.assignedDoneIssues = [];
          this.toaster.info("showing backlog issues assigned to you");
        }else if(filter == "in-progress"){
          this.assignedNewIssues = [];
          this.assignedBacklogIssues = [];
          this.assignedInProgressIssues = data.data;
          this.assignedDoneIssues = [];
          this.toaster.info("showing in-progress issues assigned to you");
        }else if(filter == "done"){
          this.assignedNewIssues = [];
          this.assignedBacklogIssues = [];
          this.assignedInProgressIssues = [];
          this.assignedDoneIssues = data.data;
          this.toaster.info("showing done issues assigned to you");
        }else if(data.status != 200){
          this.toaster.warning(data.error);
        }
      }
    )
  }

  //-----------------------------------------------------------------
  //-------------------------re-usable functions---------------------
  //-----------------------------------------------------------------

  public sideNavFlag =()=>{
    if(this.sideNavSwitch == true){
      this.sideNavSwitch = false;
    }else if(this.sideNavSwitch == false){
      this.sideNavSwitch = true;
    }
  }
  
  public logout = ()=>{

  }


}
