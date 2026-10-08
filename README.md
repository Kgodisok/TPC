# Website Link:  https://tpc-project-ad914.web.app
"# TPC" 

## Project-overview


Hello World

# ABOUT
This project is about registaring a new user, siging in and manage own tasks and also book support,book progress,play the mini-game amd print a progress summary.

#  Minimium features 
User registration,sign-in,authenticated user state and sign-out.
Dashboard displaying task tools,completed work,outstanding work and calculated progress.
Task manager with create ,read,update and delete functions.
Support-session booking form with validation and status feedback.
Search,fliter or sort functionality using arrays and higher-order functions.
Confirmation dialog before a destructive action,a redirect after an appropriate action and a printable progress summary.
At least one animation driven by javascript timers and one controlled multimedia element.
A basic operable minn-game created with an Assessor-approved JavaScript framework.

# Technologies used
1.HTML,CSS3 and JavaScript(ES6)
2.Visual Studio Code
3.Firebase Cloud Firestore (initialized; task and booking data are currently stored in localStorage)
4.Firebase authentication

# Application pseudocode

## 1. Start application
```text
START application
	LOAD the requested page and its JavaScript
	INITIALISE Firebase with the TPC project configuration
	INITIALISE the Firestore client
	READ the page type

	IF page type is landing THEN
		DISPLAY public information
		START the landing-page statistics animation
	ELSE IF page type is login THEN
		LOAD application state from localStorage
		INITIALISE Firebase Authentication when needed
		ATTACH login, registration, and tab handlers
	ELSE IF page type is dashboard THEN
		LOAD application state from localStorage
		RESTORE the Firebase or demo session
		DISPLAY the learner name, tasks, and progress
		ATTACH dashboard event handlers
		INITIALISE the learning challenge
	END IF
END application
```

## 2. Display landing page
```text
START displayLandingPage
	DISPLAY the introduction, features, support link, and progress summary
	DISPLAY the initial task, session, and progress statistics

	EVERY animation interval
		UPDATE the displayed task and progress values
	END EVERY
END displayLandingPage
```

The landing-page statistics are animated display values; they are not loaded from Firestore.

## 3. Register a user
```text
START registerUser
	READ name, email, and password

	IF any required value is missing THEN
		DISPLAY a validation error
		STOP
	END IF

	IF name contains a number THEN
		DISPLAY a name validation error
		STOP
	END IF

	IF Firebase Authentication is configured THEN
		CREATE the Firebase account with email and password
		SET the user's display name
		SAVE the Firebase user's ID, name, and email as the session
	ELSE
		IF an account with the email already exists in local state THEN
			DISPLAY an already-registered error
			STOP
		END IF
		ADD the demo account to local state
		SAVE the local session
	END IF

	SAVE local application state
	DISPLAY success feedback
	REDIRECT to the dashboard
END registerUser
```

## 4. Sign in
```text
START signIn
	READ email and password

	IF Firebase Authentication is configured THEN
		SIGN IN with Firebase Authentication
		SAVE the Firebase user's ID, name, and email as the session
	ELSE
		FIND a matching account in local state

		IF no matching account exists THEN
			DISPLAY invalid credentials and demo account guidance
			STOP
		END IF

		SAVE the local session
	END IF

	SAVE local application state
	DISPLAY success feedback
	REDIRECT to the dashboard
END signIn
```

## 5. Load dashboard and calculate progress
```text
START loadDashboard
	GET the current Firebase user when available

	IF a Firebase session exists THEN
		USE the Firebase user's name and ID
	ELSE
		RESTORE the saved local session
		IF no local session exists THEN
			USE the demo learner session when available
		END IF
	END IF

	LOAD tasks from local application state
	COUNT completed tasks
	COUNT outstanding tasks

	IF there are no tasks THEN
		SET completion percentage to zero
	ELSE
		CALCULATE completed tasks divided by total tasks as a percentage
	END IF

	DISPLAY learner name, counts, percentage, and progress bar
	DISPLAY the task list
END loadDashboard
```

## 6. Search, filter, and sort tasks
```text
START displayTasks
	COPY tasks from local application state

	IF a search term exists THEN
		KEEP tasks whose title or description contains the search term
	END IF

	IF completed filter is selected THEN
		KEEP completed tasks
	ELSE IF pending filter is selected THEN
		KEEP tasks that are not completed
	END IF

	IF priority sort is selected THEN
		SORT by high, medium, then low priority
	ELSE IF due-date sort is selected THEN
		SORT by earliest due date first
	ELSE
		SORT by latest due date first
	END IF

	IF no tasks match THEN
		DISPLAY the empty state
	ELSE
		DISPLAY each task with its due date, priority, status, and actions
	END IF
END displayTasks
```

## 7. Create or edit a task
```text
START saveTask
	READ title, due date, priority, status, and description

	IF title or due date is missing THEN
		STOP without saving
	END IF

	IF an existing task is being edited THEN
		UPDATE that task in local application state
	ELSE
		CREATE a task with a new ID and add it to local application state
	END IF

	SET completed based on whether status is Completed
	SAVE application state to localStorage
	CLEAR the form
	REFRESH task list and progress summary
END saveTask
```

## 8. Complete or delete a task
```text
START updateTaskStatus
	FIND the selected task
	TOGGLE its completed value
	SET status to Completed or Pending
	SAVE application state to localStorage
	REFRESH task list and progress summary
END updateTaskStatus

START deleteTask
	ASK the user to confirm deletion

	IF deletion is not confirmed THEN
		STOP
	END IF

	REMOVE the selected task from local application state
	SAVE application state to localStorage
	REFRESH task list and progress summary
END deleteTask
```

## 9. Book a support session
```text
START bookSession
	READ session date, type, and notes

	IF date or notes is missing THEN
		DISPLAY a validation error
		STOP
	END IF

	CREATE a confirmed booking
	ADD the booking to local application state
	SAVE application state to localStorage
	DISPLAY confirmation with session type and date
	CLEAR the booking form
END bookSession
```

## 10. Play the learning challenge
```text
START learningChallenge
	SET score to zero
	SET question number to the first question

	WHEN the user starts or restarts the challenge
		DISPLAY the current question and answer options
	END WHEN

	WHEN the user selects an answer
		DISABLE all answer options
		IF the selected answer is correct THEN
			INCREASE score
			DISPLAY positive feedback
		ELSE
			DISPLAY corrective feedback
		END IF

		AFTER a short delay
			MOVE to the next question
		END AFTER
	END WHEN

	WHEN all questions have been answered
		DISPLAY the final score and completion feedback
	END WHEN
END learningChallenge
```

## 11. Print progress summary
```text
START printProgress
	CALCULATE completed tasks, outstanding tasks, and completion percentage
	OPEN the browser print dialog
END printProgress
```

## 12. Sign out
```text
START signOut
	IF Firebase Authentication is configured THEN
		SIGN OUT the Firebase user
	END IF

	CLEAR the local session
	SAVE local application state
	REDIRECT to the landing page
END signOut
```

Firebase Firestore is initialized for the application, but authentication is handled by Firebase Authentication and task, booking, and demo session data are currently stored in localStorage. The task and booking flows do not yet read from or write to Firestore.

# Installation
1.Clone the repository
2.Open the project folder
3.Open the application in VS code.
4.Run the application

# Authors 
Kgodiso Motsepe,Karrel Esterhuizen,Sbusiso Nhlapho