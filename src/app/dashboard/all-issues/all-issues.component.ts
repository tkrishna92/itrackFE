import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DashboardService } from 'src/dashboard.service';
import { UserService } from 'src/user.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { SocketService } from 'src/socket.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-all-issues',
  templateUrl: './all-issues.component.html',
  styleUrls: ['./all-issues.component.css'],
  providers : [SocketService]
})
export class AllIssuesComponent implements OnInit {

  @ViewChild('scrollMe', { read: ElementRef, static: true })
  public scrollMe: ElementRef;

  public assignIcon : string = "assets/icons/assigned.png"
  public watchingIcon : string = "assets/icons/watching.png"
  public reportedIcon : string = "assets/icons/reported.png"
  public allIssuesIcon : string = "assets/icons/allIssues.png"
  public deleteIcon : string = "assets/icons/delete.png"

  public fileToUpload :File = null;
  public authToken : string;
  public userName : string;
  public userId : string;
  public email : string;
  public filter : string;
  public newTitle : string;
  public newDescription : string;
  public assignIssueToId : string;
  public assignedToUser : string;
  public issuesSelected : string;
  public currentIssue : string;  
  public editedTitle : string;
  public editedDescription :string;
  public selectedStatus : string;
  public titleSearchString : string;
  public pagesCount : number;
  public currentCommentSkip : number;
  public sideNavSwitch : boolean;
  public assignedIssuesSelected : boolean;
  public watchingIssuesSelected : boolean;
  public reportedIssuesSelected : boolean;
  public watchingCurrentIssue :boolean;
  public retreivedIssues : any[] = [];
  public allUsers:any[]=[];
  public pages:any[]=[];
  public selectedIssueDetails:any[] = [];
  public watchersList:any[] = [];
  public availableStatus :any[] = [];
  public issueComments : any[] = [];
  public uploadedFileData : any[] = [];
  public allFilesInfo : any[] = [];

  public CommentEditor : FormGroup;  // for quill form
  public editorStyle = {
    height: '300px',
    backgroundColor : 'white',
    maxWidth : '700px'
  }

  public config = {
    toolbar : [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    // [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    // [{ 'align': [] }],

    ['clean']
    ]
  }

  constructor(private dashboard: DashboardService, private userService : UserService, private cookies : CookieService, private toaster : ToastrService, private spinner : NgxSpinnerService, private router : Router, private socketService : SocketService ) { }

  ngOnInit(): void {

    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 2500)

    this.CommentEditor = new FormGroup({
      editor : new FormControl(null)
    });
    

    this.authToken = (this.cookies.get('authToken').length>0)?this.cookies.get('authToken'):this.userService.getUserDetails()["authToken"];
    this.userName = (this.cookies.get('userName').length>0)?this.cookies.get('userName'):`${this.userService.getUserDetails()["userDetails"]["firstName"]} ${this.userService.getUserDetails()["userDetails"]["lastName"]}`;
    this.userId = (this.cookies.get('userId').length>0)?this.cookies.get('userName'):`${this.userService.getUserDetails()["userDetails"]["userId"]}`;
    this.email = (this.cookies.get('email').length>0)?this.cookies.get('email'):this.userService.getUserDetails()["userDetails"]["email"];
    this.sideNavSwitch = true;
    this.assignedIssuesSelected = true;
    this.watchingIssuesSelected = false;
    this.reportedIssuesSelected = false;
    this.issuesSelected = "assigned";
    this.assignedToUser = "";
    this.currentIssue = "";
    this.pagesCount = 1;
    this.pages = [0];
    this.availableStatus = ["new", "backlog", "in-progress", "done"];

    this.verifyUser();
    this.getAllUsers();
    setTimeout(()=>{
      this.joinAllIssueRooms();
      this.getAssignedIssues("new");
      this.getIssueNotification(); 
    },10);
    this.getAllFiles();
    
  }

  //-----------------------------------------------------------------
  //--------------------------------Socket functions-----------------
  //-----------------------------------------------------------------

  //verifyUser event handler
  public verifyUser = ()=>{
    this.socketService.verifyUser().subscribe(
      data =>{
        console.log("verifyUser received");
        this.socketService.checkAuthToken(this.authToken)
      }
    )
  }

  //joining issue room to get notifications on issue
  public joinIssueRoom = (issue)=>{
    this.socketService.joinIssueRooms(issue)
  }

  //handle issue notifications received on watching issues
  public getIssueNotification = ()=>{
    this.socketService.getIssueNotification().subscribe(
      data=>{
        console.log(data);
        this.toaster.info(data.notification).onTap.subscribe(()=>{
          this.getAllIssues(data.filter);
          setTimeout(()=>{
            this.selectCurrentIssue(data.issueId);
          },100);
        });
      }
    )
  }
  
  

  //-----------------------------------------------------------------
  //--------------------------------Http calls-----------------------
  //-----------------------------------------------------------------


  //get assigned issues
  public getAssignedIssues = (filter?, skip?)=>{
    this.filter = (filter.length>0)?filter:"new";
    let data = {
      filter : this.filter,
      skip : skip*10
    }
    console.log(data);
    this.dashboard.getAssignedIssues(data).subscribe(
      data=>{
        this.retreivedIssues = [];
        this.createPages(data.count);
        this.issuesSelected= "assigned";
        if(this.filter == "new" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing new issues assigned to you");
        }else if(this.filter == "backlog" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing backlog issues assigned to you");
        }else if(this.filter == "in-progress" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing in-progress issues assigned to you");
        }else if(this.filter == "done" && data.status == 200){
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
  public getWatchingIssues = (filter?, skip?)=>{
    this.filter = (filter.length>0)?filter:"new";
    let data = {
      filter : this.filter,
      skip : skip*10
    }
    console.log(data);
    this.dashboard.getWatchingIssues(data).subscribe(
      data=>{
        this.retreivedIssues = [];
        this.createPages(data.count);
        this.issuesSelected= "watching";
        if(this.filter == "new" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing new issues being watched by you");
        }else if(this.filter == "backlog" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing backlog issues being watched by you");
        }else if(this.filter == "in-progress" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing in-progress issues being watched by you");
        }else if(this.filter == "done" && data.status == 200){
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
  public getReportedIssues = (filter?, skip?)=>{
    this.filter = (filter.length>0)?filter:"new";
    let data = {
      filter : this.filter,
      skip : skip*10
    }
    console.log(data);
    this.dashboard.getReportedIssues(data).subscribe(
      data=>{
        this.retreivedIssues = [];
        this.createPages(data.count);
        this.issuesSelected= "reported";
        if(this.filter == "new" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing new issues reported by you");
        }else if(this.filter == "backlog" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing backlog issues reported by you");
        }else if(this.filter == "in-progress" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing in-progress issues reported by you");
        }else if(this.filter == "done" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing done issues reported by you");
        }else if(data.status != 200){
          this.retreivedIssues = [];
          this.toaster.warning(data.message);
        }
        this.addNamesToIssues();
      }
    )
  }

  //get assigned issues
  public getAllIssues = (filter?, skip?)=>{
    this.filter = (filter.length>0)?filter:"new";
    let data = {
      filter : this.filter,
      skip : skip*10
    }
    this.dashboard.getAllIssues(data).subscribe(
      data=>{
        console.log(data);
        
        this.retreivedIssues = [];
        this.createPages(data.count);
        this.issuesSelected= "allIssues";
        if(this.filter == "new" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing all new issues");
        }else if(this.filter == "backlog" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing all backlog issues");
        }else if(this.filter == "in-progress" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing all in-progress issues");
        }else if(this.filter == "done" && data.status == 200){
          this.retreivedIssues = data.data;
          this.toaster.info("showing all done issues");
        }else if(data.status != 200){
          this.retreivedIssues = [];
          this.toaster.warning(data.message);
        }
        this.addNamesToIssues();
      }
    )
  }

  //search for issue titles
  public searchOnKeyPress =(event : any)=>{
    if(event.keyCode === 13 || event.keyCode === 32){
      console.log(this.titleSearchString);
      this.dashboard.searchIssueTitle(this.titleSearchString).subscribe(
        data=>{
          this.retreivedIssues = [];
          if(data.status == 200){
            this.retreivedIssues = data.data;
            this.createPages(data.count);
            this.filter = "";
            this.issuesSelected = "";
            this.toaster.success(data.message);
            this.addNamesToIssues();
          }else{
            this.toaster.warning(data.message);
          }
        }
      )
    }
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

  //delete current issue
  public deleteIssue = (issueId)=>{
    this.dashboard.deleteIssue(issueId).subscribe(
      data=>{
        if(data.status == 200){
          this.currentIssue = "";
          this.getIssues(this.issuesSelected);
          this.toaster.success(data.message);
        }else{
          this.toaster.warning(data.message);
        }
      }
    )
  }

  //edit issue
  public editIssue = ()=>{
    let editeIssueData = {
      issueId : this.currentIssue,
      title : this.editedTitle,
      description : this.editedDescription
    }
    this.dashboard.editIssue(editeIssueData).subscribe(
      data=>{
        if(data.status == 200){
          this.toaster.success(data.message);
          this.getIssues(this.issuesSelected);
          let notification = {
            issueId : editeIssueData.issueId,
            filter : this.filter,
            notification : `${this.userName} edited ${this.editedTitle}`
          }
          this.socketService.sendIssueActionNotification(notification);          
          setTimeout(()=>{
            this.selectCurrentIssue(editeIssueData.issueId);
          }, 10);
        }else{
          this.toaster.warning(data.message);
        }
      }
    )
  }

  //assign issue to another user
  public reassignTo= (userId, issueId)=>{
    let paramData = {
      issueId : issueId,
      assignToId : userId
    }
    this.dashboard.assignIssue(paramData).subscribe(
      data=>{
        if(data.status == 200){
          this.toaster.success(data.message);
          let notification = {
            issueId : paramData.issueId,
            filter : this.filter,
            notification : `${this.userName} assigned an issue to another user`
          }
          this.socketService.sendIssueActionNotification(notification);
        }else{
          this.toaster.warning(data.message);
        }
      }
    )
  }

  //add issue to logged in user's watch list
  public addToWatchList = (issueId)=>{
    this.dashboard.watchIssue(issueId).subscribe(
      data=>{
        if(data.status == 200){
          this.toaster.success(data.message);
          this.joinIssueRoom(issueId);
        }else {
          this.toaster.warning(data.message);
        }
      }
    )
  }

  //change issue status
  public changeIssueStatus = (status)=>{
    this.selectedStatus = status;
    let paramData = {
      issueId : this.currentIssue,
      newStatus : this.selectedStatus
    }
    this.dashboard.changeIssueStatus(paramData).subscribe(
      data=>{
        if(data.status == 200){
          this.setFilter(this.selectedStatus);
          this.toaster.success(data.message);          
          let notification = {
            issueId : paramData.issueId,
            filter : this.filter,
            notification : `${this.userName} moved a status to ${paramData.newStatus}`
          }
          this.socketService.sendIssueActionNotification(notification);
        }else{
          this.toaster.warning(data.message);
        }
      }
    )
  }

  //get all comments of issue
  public getIssueComments = (issueId, skip?)=>{
    if(skip > 0){
      this.currentCommentSkip = skip;
    }else{
      this.currentCommentSkip = 0
    }
    let data = {
      issueId : issueId,
      skip : this.currentCommentSkip
    }
    console.log(data);
    this.dashboard.getIssueComment(data).subscribe(
      data=>{
        if(data.status == 200){
          console.log(data);
          this.issueComments = data.data;
          this.issueComments.map((comment)=>{
            for(let user of this.allUsers){
              if(comment.commenterId == user.userId){
                comment["commenterName"] = `${user.firstName} ${user.lastName}`
              }
            }
          })
        }else{
          this.toaster.info(data.message);
        }
      }
    )
  }

  //create a comment on this issue
  public createComment = ()=>{
    let newComment = this.CommentEditor.get('editor').value;    
    let paramData = {
      issueId : this.currentIssue,
      comment : newComment
    }
    this.dashboard.createNewComment(paramData).subscribe(
      data=>{
        if(data.status == 200){
          this.uploadFile("comment", data.data.commentId);
          console.log(this.uploadedFileData);
          console.log(newComment);
          this.toaster.success(data.message);
          this.getIssueComments(this.currentIssue)
          let notification = {
            issueId : paramData.issueId,
            filter : this.filter,
            notification : `${this.userName} made a new comment`
          }
          this.socketService.sendIssueActionNotification(notification);
        }else{
          this.toaster.warning(data.message);
        }
      }
    )
    this.CommentEditor.reset();
    
  }

  //delete comment
  public deleteComment = (commentId)=>{
    this.dashboard.deleteComment(commentId).subscribe(
      data=>{
        if(data.status == 200){
          this.toaster.success(data.message);
          this.getIssueComments(this.currentIssue);
          let notification = {
            issueId : this.currentIssue,
            filter : this.filter,
            notification : `${this.userName} deleted a comment`
          }
          this.socketService.sendIssueActionNotification(notification);
        }else{
          this.toaster.warning(data.message);
        }
      }
    )
  }

  //get all files info
  public getAllFiles = ()=>{
    this.dashboard.getAllFiles().subscribe(
      data=>{
        if(data.status == 200){
          this.allFilesInfo = data.data;
          console.log(this.allFilesInfo);
        }else if(data.status == 500){
          this.toaster.warning(data.message);
        }
      }
    )
  }

  //uploading file
  public uploadFile = (type, typeId)=>{
    this.dashboard.uploadFile(this.fileToUpload, type, typeId).subscribe(
      data=>{
        console.log(data);
      }
    ) 
  }


  //download files
  public downloadFile = (fileId, fileName)=>{
    console.log(fileId);
    console.log(fileName);
    this.dashboard.downloadFiles(fileId, fileName)
  }


  //--------------------Http calls using user service----------------

  public getAllUsers = ()=>{
    this.userService.getAllUserDetails(this.authToken).subscribe(
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
    console.log(this.sideNavSwitch);
    console.log(this.currentIssue.length);
    console.log(this.filter)
    if(this.sideNavSwitch == true){
      this.sideNavSwitch = false;
    }else{
      this.sideNavSwitch = true;
    }
  }

  public setFilter = (filter?)=>{
    this.currentIssue = "";
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
    this.currentIssue = "";
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

  public getPagesIssues= (skip)=>{
    this.currentIssue = "";
    if(this.issuesSelected == "assigned"){
      this.getAssignedIssues(this.filter, skip);
    }else if(this.issuesSelected == "watching"){
      this.getWatchingIssues(this.filter, skip);
    }else if(this.issuesSelected == "reported"){
      this.getReportedIssues(this.filter, skip);
    }else if(this.issuesSelected == "allIssues"){
      this.getAllIssues(this.filter, skip);
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
  
  //function to create pages
  public createPages = (count)=>{
    this.pages = [];
    if(count>10){
      this.pagesCount = Math.floor(count/10)+1;
      for(let i = 0; i < this.pagesCount; i++ ){
        this.pages.push(i);
      }
    }else{
      this.pagesCount = 1;
      this.pages = [0];
    }
  }

  public selectedAssignee = (userId, firstName, lastName)=>{
    this.assignIssueToId = userId;
    this.assignedToUser = `${firstName} ${lastName}`
  }
  
//------------------------------------------------------------------------------
//--------------------------------------single issue functions------------------
//------------------------------------------------------------------------------

//select signle issue
public selectCurrentIssue = (issueId)=>{
  this.currentIssue = issueId;
  this.watchersList = [];
  this.retreivedIssues.map((issue)=>{
    if(issue.issueId == issueId){
      this.selectedIssueDetails[0] = issue;
      this.editedTitle = issue.title;
      this.editedDescription = issue.description;
      this.getIssueComments(this.currentIssue, 0);
      console.log(this.selectedIssueDetails);
      for(let watcher of issue.watchersId){
        for(let user of this.allUsers){
          if(user.userId == watcher){
            this.watchersList.push(`${user.firstName} ${user.lastName}`)
          }
        }
      }
      for(let watcher of issue.watchersId){
        if(watcher == this.userId){
          console.log(watcher);
          this.watchingCurrentIssue = true;
          break;
        }else{
          this.watchingCurrentIssue = false;
        }
      }
    }
  })
  console.log(this.watchersList);
}

//join all the issue rooms that the user is currently watching
public joinAllIssueRooms = ()=>{
  this.userService.getSingleUserDetails(this.userId, this.authToken).subscribe(
    data=>{
      if(data.status == 200){
        console.log(data);
        for(let issue of data.data.watchingIssues){
          this.joinIssueRoom(issue);
        }
      }
    }
  )
}

//handling file upload
public handleCommentFile = (files : FileList)=>{
  this.fileToUpload = files.item(0);
  console.log(this.fileToUpload);
}


  public logout = ()=>{
    this.userService.logout(this.authToken).subscribe(
      data=>{
        if(data.status == 200){
          this.toaster.success(data.message);
          this.cookies.delete('authToken');
          this.cookies.delete('userName');
          this.cookies.delete('userId');
          this.socketService.disconnectSocket();
          this.router.navigate(['/']);
        }else{
          this.toaster.error(data.message);
        }
      }
    )
  }


}
