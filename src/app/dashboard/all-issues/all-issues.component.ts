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
  public filter : string;
  public newTitle : string;
  public newDescription : string;
  public assignIssueToId : string;
  public assignedToUser : string;
  public sideNavSwitch : boolean;
  public assignedIssuesSelected : boolean;
  public watchingIssuesSelected : boolean;
  public reportedIssuesSelected : boolean;
  public allIssuesSelected : boolean;
  public newIssues:any[] = [];
  public backlogIssues:any[] = [];
  public inProgressIssues : any[] = [];
  public doneIssues : any[] = [];
  public allUsers:any[]=[];

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
    this.assignedToUser = "";

    this.getAllUsers();
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
        this.filter = "new";
        console.log(data);
        this.assignedIssuesSelected= true;
        if(filter == "new" && data.status == 200){
          this.filter = "new";
          this.newIssues = data.data;
          this.backlogIssues = [];
          this.inProgressIssues = [];
          this.doneIssues = [];
          // this.toaster.info("showing new issues assigned to you");
        }else if(filter == "backlog" && data.status == 200){
          this.filter = "backlog";
          this.newIssues = [];
          this.backlogIssues = data.data;
          this.inProgressIssues = [];
          this.doneIssues = [];
          this.toaster.info("showing backlog issues assigned to you");
        }else if(filter == "in-progress" && data.status == 200){
          this.filter = "in-progress";
          this.newIssues = [];
          this.backlogIssues = [];
          this.inProgressIssues = data.data;
          this.doneIssues = [];
          this.toaster.info("showing in-progress issues assigned to you");
        }else if(filter == "done" && data.status == 200){
          this.filter = "done";
          this.newIssues = [];
          this.backlogIssues = [];
          this.inProgressIssues = [];
          this.doneIssues = data.data;
          this.toaster.info("showing done issues assigned to you");
        }else if(data.status != 200){
          this.toaster.warning(data.message);
        }
      }
    )
  }

  //create new issue 
  public createNewIssue = ()=>{
    let newIssueParam = {
        issueTitle : this.newTitle,
        issueDescription : this.newDescription,
        assignedToId : this.assignIssueToId
    }
    console.log(newIssueParam);
    this.dashboard.createIssue(newIssueParam).subscribe(
      data=>{
        if(data.status == 200){
          this.toaster.success(data.message);
          
        }else{
          this.toaster.warning(data.message);
        }
      }
    )
  }

  //--------------------Http calls using user service----------------

  public getAllUsers = ()=>{
    this.userService.getAllUserDetails().subscribe(
      data=>{
        if(data.status == 200){
          console.log(data);
          this.allUsers = data.data;
        }else{
          this.toaster.warning(data.message);
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

  public selectedAssignee = (userId, firstName, lastName)=>{
    console.log(userId);
    this.assignIssueToId = userId;
    this.assignedToUser = `${firstName} ${lastName}`
  }
  
  public logout = ()=>{

  }


}
