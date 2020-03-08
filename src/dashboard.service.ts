import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  public issueUrl = "http://localhost:3000/api/v1/issue";
  // public issueUrl = "http://api.webdevk.com/api/v1/issue";

  constructor(private _http : HttpClient, private cookies : CookieService) { }

  //get all the assigned issues
  public getAssignedIssues = (data):any=>{
    let getAssignedIssueParams = new HttpParams()
    .set('statusFilter', data.filter)
    .set('skip', data.skip)
    return this._http.put(`${this.issueUrl}/getAssignedIssues?authToken=${this.cookies.get('authToken')}`,getAssignedIssueParams);
  }

  //get all issues with filters
  public getAllIssues = (data):any=>{
    let getAllIssuesParams = new HttpParams()
    .set('statusFilter', data.filter)
    .set('skip', data.skip)
    return this._http.put(`${this.issueUrl}/getAllIssues?authToken=${this.cookies.get('authToken')}`, getAllIssuesParams);
  }

  //create a new issue
  public createIssue = (data):any=>{
    let createIssueParams = new HttpParams()
    .set('issueTitle', data.issueTitle)
    .set('issueDescription', data.issueDescription)
    .set('assignedToId', data.assignedToId)
    return this._http.post(`${this.issueUrl}/createIssue?authToken=${this.cookies.get('authToken')}`, createIssueParams);
  }

  //delete issues
  public deleteIssue = (issueId):any=>{
    let deleteIssueParams = new HttpParams()
    .set('issueId', issueId)
    return this._http.put(`${this.issueUrl}/deleteIssue?authToken="${this.cookies.get('authToken')}`, deleteIssueParams);
  }

  //edit issue
  public editIssue = (data):any=>{
    let editIssueParams = new HttpParams()
    .set('issueId', data.issueId)
    .set('title', data.title)
    .set('description', data.description)
    return this._http.post(`${this.issueUrl}/editIssue?authToken=${this.cookies.get('authToken')}`, editIssueParams);
  }

  //assign issue to another user
  public assignIssue = (data):any=>{
    let assignIssueParams = new HttpParams()
    .set('issueId', data.issueId)
    .set('assignToId', data.assignToId)
    return this._http.put(`${this.issueUrl}/assignIssue?authToken=${this.cookies.get('authToken')}`, assignIssueParams);
  }

  //watch an issue
  public watchIssue =(issueId):any=>{
    let watchIssueParams = new HttpParams()
    .set('issueId', issueId)
    return this._http.put(`${this.issueUrl}/watchIssue?authToken=${this.cookies.get('authToken')}`, watchIssueParams);
  }

  //change issue status
  public changeIssueStatus = (data):any=>{
    let changeIssueStatusParams = new HttpParams()
    .set('issueId', data.issueId)
    .set('newStatus', data.newStatus)
    return this._http.put(`${this.issueUrl}/changeIssueStatus?authToken=${this.cookies.get('authToken')}`, changeIssueStatusParams);
  }

  //search for issue titles
  public searchIssueTitle = (searchString):any=>{
    let searchIssueTitleParams = new HttpParams()
    .set('searchString', searchString)
    return this._http.put(`${this.issueUrl}/searchIssueTitle?authToken=${this.cookies.get('authToken')}`,searchIssueTitleParams);
  }

  //create comment on issue
  public createNewComment = (data):any=>{
    let createNewCommentParams = new HttpParams()
    .set('issueId', data.issueId)
    .set('comment', data.comment)
    return this._http.post(`${this.issueUrl}/createNewComment?authToken=${this.cookies.get('authToken')}`, createNewCommentParams);
  }

  //get comments of the issue
  public getIssueComment = (data):any=>{
    let getIssueCommentParams = new HttpParams()
    .set('issueId', data.issueId)
    .set('skip', data.skip)
    return this._http.put(`${this.issueUrl}/getIssueComment?authToken=${this.cookies.get('authToken')}`, getIssueCommentParams);
  }

  //delete comment made by the logged in user
  public deleteComment = (commentId):any=>{
    let deleteCommentParams = new HttpParams()
    
  }

  


}
