iTrack App

Front-end code : https://github.com/tkrishna92/itrackFE
Frone-end deployed code : https://github.com/tkrishna92/itrackDeployedFE
Back-end code : https://github.com/tkrishna92/itrackBE
Application Link : http://webdevk.com/signup

Local Testing directions :
	
	Pull the code from above mentioned links for front-end and back-end to a local location
	
	Using command line utility install npm and node and then install the required node_modules of front end and back end from respective local locations
	
	Go to the front end location from command line and use commands "ng serve"

	Go to the back end code location from command ling and use command "node index.js"

	from browser go to http://localhost:3000/
	

Project description

This is an issue tracking application that can be used in project managements system as well. The application allows users to report issues and assign them to other users. This application also allows management of issues assigned to the users such as moving them to different stages of issue cycle. Users can also comment on the issues. An issue of interest can be also watched by user even if they are not assigned with the issue. 

Application’s functionalities: 

User Management System : 

a.	Signup:	Users can sign up on the platform providing all details like FirstName, LastName, Email and Mobile number. Country code for mobile number (like 91 for India) should also be stored.

b.	Login :User can login using the credentials provided at signup.

c.	Forgot password: User can recover password using the link shown in the above login page. 

	If a user forgets password, the “forgot password” link can be used to access a page that will require security questions to verify the account. On providing correct information the user will be able to change the password using the link provided
	
	The link will be provided after entering security question and will be valid for changing the password for only 2 minutes

	

Personalized Dashboard:

On login a personalized dashboard shows the user all the new issues that have been assigned to the user.

1.	Status : it shows the current status of the issue such as new, backlog, in-progress, done
2.	Title : it shows the title of the issue
3.	Reporter : dashboard shows the name of the reporter
4.	Assigned to : dashboard shows the name of the user to whom each issue has been assigned to
5.	Date : dashboard shows the date each of the issue has been created on.
6.	Search box : the dashboard has a search box for searching titles
7.	Create button : dashboard has a create button that allows logged in user to report issues

All the tables are paginated. And sorting can be done based on issues that are assigned to the user, reported by the user, issues being watched by the user and all the issues available.

Issue Description : 

1.	The reporter will be able to do CRUD operations on the issue and the related comments
2.	The reporter and the assignee user will be able to assign this issue to any other user. 
3.	There will be a comments section where any user will be able to make comments regarding the issue
4.	Any user will be able to add the issue to their watch list and this will allow the watchers to receive notifications of any changes and comments. The issues also have a button to show the watchers of the issue
5.	Notifications come over the screen with a short description of what has changed and some notifications on receiving can be used to navigate to the issue’s description related to the notification

Search Issue : 

1.	Users can search for any text in the titles
2.	The results are shows in a table having all the issues related to the search title
3.	This table is similar to the personalized dashboard and is paginated.

Real-time functionality : 
 All the notifications are real time and any changes are notified in real time as notifications.

