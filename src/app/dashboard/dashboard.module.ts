import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//angular modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


//external modules
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';

//components and services of this module
import { AllIssuesComponent } from './all-issues/all-issues.component';
import { SelectedIssueComponent } from './selected-issue/selected-issue.component';



@NgModule({
  declarations: [AllIssuesComponent, SelectedIssueComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,  //for quill
    QuillModule.forRoot(),          //for quill
    ToastrModule.forRoot(),
    RouterModule.forChild([
      { path : 'dashboard', component : AllIssuesComponent },
      { path : 'issue', component : SelectedIssueComponent }
    ])
  ]
})
export class DashboardModule { }
