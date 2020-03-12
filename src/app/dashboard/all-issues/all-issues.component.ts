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
  public issuesSelected : string;
  public pages : number;
  public sideNavSwitch : boolean;
  public assignedIssuesSelected : boolean;
  public watchingIssuesSelected : boolean;
  public reportedIssuesSelected : boolean;
  public retreivedIssues : any[] = [];
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
    this.issuesSelected = "assigned";
    this.assignedToUser = "";
    this.pages = 0;

    this.getAllUsers();
    setTimeout(()=>{
      this.getAssignedIssues("new");
    },10);
    
  }

  //-----------------------------------------------------------------
  //--------------------------------Http calls-----------------------
  //-----------------------------------------------------------------

  //get assigned issues
  public getAssignedIssues = (filter, skip?)=>{
    let data = {
      filter : filter,
      skip : skip*10
    }
    console.log(data);
    this.dashboard.getAssignedIssues(data).subscribe(
      data=>{
        this.retreivedIssues = [];
        this.filter = filter;
        console.log(data);
        if(data.count>10){
          this.pages = Math.floor(data.count/10);
          console.log(this.pages);
        }else{
          this.pages = 0;
          console.log(this.pages)
        }
        this.issuesSelected= "assigned";
        if(filter == "new" && data.status == 200){
          this.retreivedIssues = data.data;
          // this.toaster.info("showing new issues assigned to you");
        }else if(filter == "backlog" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing backlog issues assigned to you");
        }else if(filter == "in-progress" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing in-progress issues assigned to you");
        }else if(filter == "done" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing done issues assigned to you");
        }else if(data.status != 200){
          this.retreivedIssues = [];
          this.toaster.warning(data.message);
        }
        this.addNamesToIssues();
      }
    )
  }

  //get assigned issues
  public getWatchingIssues = (filter, skip?)=>{
    let data = {
      filter : filter,
      skip : skip*10
    }
    console.log(data);
    this.dashboard.getWatchingIssues(data).subscribe(
      data=>{
        this.retreivedIssues = [];
        this.filter = filter;
        console.log(data);
        this.issuesSelected= "watching";
        if(filter == "new" && data.status == 200){
          this.retreivedIssues = data.data;
          // this.toaster.info("showing new issues being watched by you");
        }else if(filter == "backlog" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing backlog issues being watched by you");
        }else if(filter == "in-progress" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing in-progress issues being watched by you");
        }else if(filter == "done" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing done issues being watched by you");
        }else if(data.status != 200){
          this.retreivedIssues = [];
          this.toaster.warning(data.message);
        }
        this.addNamesToIssues();
      }
    )
  }

  //get assigned issues
  public getReportedIssues = (filter, skip?)=>{
    let data = {
      filter : filter,
      skip : skip*10
    }
    console.log(data);
    this.dashboard.getReportedIssues(data).subscribe(
      data=>{
        this.retreivedIssues = [];
        this.filter = filter;
        console.log(data);
        this.issuesSelected= "reported";
        if(filter == "new" && data.status == 200){
          this.retreivedIssues = data.data;
          // this.toaster.info("showing new issues assigned to you");
        }else if(filter == "backlog" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing backlog issues assigned to you");
        }else if(filter == "in-progress" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing in-progress issues assigned to you");
        }else if(filter == "done" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing done issues assigned to you");
        }else if(data.status != 200){
          this.retreivedIssues = [];
          this.toaster.warning(data.message);
        }
        this.addNamesToIssues();
      }
    )
  }

  //get assigned issues
  public getAllIssues = (filter, skip?)=>{
    let data = {
      filter : filter,
      skip : skip*10
    }
    console.log(data);
    this.dashboard.getAllIssues(data).subscribe(
      data=>{
        this.retreivedIssues = [];
        this.filter = filter;
        console.log(data);
        this.issuesSelected= "allIssues";
        if(filter == "new" && data.status == 200){
          this.retreivedIssues = data.data;
          // this.toaster.info("showing new issues assigned to you");
        }else if(filter == "backlog" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing backlog issues assigned to you");
        }else if(filter == "in-progress" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing in-progress issues assigned to you");
        }else if(filter == "done" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing done issues assigned to you");
        }else if(data.status != 200){
          this.retreivedIssues = [];
          this.toaster.warning(data.message);
        }
        this.addNamesToIssues();
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
          this.filter= "new";
          this.getIssues("reported");
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

  public setFilter = (filter?)=>{
    this.filter = filter;
    if(this.issuesSelected == "assigned"){
      this.getAssignedIssues(filter);
    }else if(this.issuesSelected == "watching"){
      this.getWatchingIssues(filter);
    }else if(this.issuesSelected == "reported"){
      this.getReportedIssues(filter);
    }else if(this.issuesSelected == "allIssues"){
      this.getAllIssues(filter);
    }
  }

  public getIssues = (selectedIssueType)=>{
    this.issuesSelected = selectedIssueType;
    if(this.issuesSelected == "assigned"){
      this.getAssignedIssues(this.filter);
    }else if(this.issuesSelected == "watching"){
      this.getWatchingIssues(this.filter);
    }else if(this.issuesSelected == "reported"){
      this.getReportedIssues(this.filter);
    }else if(this.issuesSelected == "allIssues"){
      this.getAllIssues(this.filter);
    }
  }


  // function to add reporter name and assigned to name to the issue array elements
  public addNamesToIssues = ()=>{
    this.getAllUsers();
    for(let issue of this.retreivedIssues){
      for(let user in this.allUsers){
        if(this.allUsers[user].userId == issue.reporterId && this.allUsers[user].userId == issue.assignedToId){
          issue["reporterName"] =`${this.allUsers[user].firstName} ${this.allUsers[user].lastName}`;
          issue["assigneeName"] = `${this.allUsers[user].firstName} ${this.allUsers[user].lastName}`;
        }else if(this.allUsers[user].userId != issue.reporterId && this.allUsers[user].userId == issue.assignedToId){
          issue["assigneeName"] = `${this.allUsers[user].firstName} ${this.allUsers[user].lastName}`;
        }else if(this.allUsers[user].userId == issue.reporterId && this.allUsers[user].userId != issue.assignedToId){
          issue["reporterName"] =`${this.allUsers[user].firstName} ${this.allUsers[user].lastName}`;
        }
      }
    }
  }
  

  public selectedAssignee = (userId, firstName, lastName)=>{
    this.assignIssueToId = userId;
    this.assignedToUser = `${firstName} ${lastName}`
  }
  
  public logout = ()=>{

  }


}
