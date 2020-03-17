import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';
import { Observable, observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http'
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  // public url = "http://localhost:3000";
  public url = "http://api.webdevk.com";

  public socket;

  constructor(private _http: HttpClient, private cookies : CookieService,) { 
    this.socket = io(this.url);
  }

  //handling error events from socket
  public socketError = ()=>{
    return Observable.create((observer)=>{
      this.socket.on("error-occurred", (data)=>{
        observer.next(data);
      })
    })
  }

  //handling "verifyUser" event that should be received on successful handshake with the socket
  public verifyUser = ()=>{
    return Observable.create((observer)=>{
      this.socket.on("verifyUser", ()=>{
        observer.next();
      })
    })
  }

  //on checking authToken server sends "user-loggedin" event
  public verifyUserLoggedIn = ()=>{
    return Observable.create((observer)=>{
      this.socket.on("user-loggedin", (data)=>{
        observer.next(data);
      })
    })
  }

  //get action notifications on issues
  public getIssueNotification = ()=>{
    return Observable.create((observer)=>{
      this.socket.on('action-notification', (notification)=>{
        observer.next(notification);
      })
    })
  }



  //------------------------------------------------------------------
  //----------------------emiting events to socket--------------------
  //------------------------------------------------------------------
  public checkAuthToken = (authToken)=>{
    this.socket.emit("auth-user", (authToken));
  }

  public checkUserLogin = (userId)=>{
    this.socket.emit("check-user-login", userId);
  }

  public joinIssueRooms = (issueId)=>{
    this.socket.emit('join-issue-room', issueId);
  }

  public sendIssueActionNotification = (data)=>{
    this.socket.emit('issue-action', data);
  }

  public disconnectSocket = ()=>{
    this.socket.disconnect();
  }

}
