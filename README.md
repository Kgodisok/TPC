# SkillsTrack Learner Portal

Website: https://tpc-project-ad914.web.app

SkillsTrack lets learners manage personal learning tasks, track progress, and send support requests to their school. Accounts use Firebase Authentication; learner profiles, tasks, and support requests are stored in Cloud Firestore.

## Technologies

- HTML, CSS, and JavaScript
- Firebase Authentication (email/password)
- Cloud Firestore
- Express static server for local development

## Run locally

1. Install dependencies with `npm install`.
2. Start the site with `npm start`.
3. Open http://localhost:3000.

Firebase Auth and Firestore configuration is in `firebase.json`. Before deploying, select the `tpc-project-ad914` project and deploy the Auth provider and Firestore rules with `npx firebase-tools@latest deploy --only auth,firestore:rules --project tpc-project-ad914`. Deploy the site with `npx firebase-tools@latest deploy --only hosting --project tpc-project-ad914`.

## Application pseudocode

### 1. Start application
```text
START application
	LOAD the requested page and its JavaScript
	INITIALISE Firebase with the TPC project configuration
	INITIALISE the Firestore client
	READ the page type

	IF page type is landing THEN
		DISPLAY public information
	ELSE IF page type is login THEN
		ATTACH login, registration, and tab handlers
	ELSE IF page type is dashboard THEN
		OBSERVE Firebase Authentication state
		IF user is signed in THEN
			LOAD the user's Firestore profile, tasks, and support requests
			DISPLAY learner dashboard
		ELSE
			REDIRECT to sign in
		END IF
	END IF
END application
```

### 2. Register a learner
```text
START registerUser
	READ name, email, and password

	IF any required value is missing THEN
		DISPLAY a validation error
		STOP
	END IF

	IF name or email has an invalid format OR password does not meet strength rules THEN
		DISPLAY the specific validation feedback
		STOP
	END IF

	CREATE account with Firebase Authentication
	SET the Firebase display name
	CREATE a private Firestore profile at users/{uid}
	DISPLAY account-created feedback
	REDIRECT to the dashboard
ON ERROR
	DISPLAY a useful account or network error
END registerUser
```

### 3. Sign in and sign out
```text
START signIn
    READ email and password
    SIGN IN with Firebase Authentication
    IF sign-in succeeds THEN
        DISPLAY success feedback
        REDIRECT to the dashboard
    ELSE
        DISPLAY an actionable error
    END IF
END signIn

START signOut
    SIGN OUT with Firebase Authentication
    STOP Firestore listeners
    REDIRECT to the public landing page
END signOut
```

### 4. Load learner data and progress
```text
START loadDashboard
	CHECK Firebase Authentication state
	READ profile from users/{uid}
	SUBSCRIBE to users/{uid}/tasks and users/{uid}/bookings
	WHEN task snapshots change
		DISPLAY tasks
		CALCULATE completed and outstanding counts
		CALCULATE progress percentage
	END WHEN
END loadDashboard
```

### 5. Search, filter, and sort tasks
```text
START displayTasks
	COPY the current Firestore task snapshot

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

### 6. Create or edit a task
```text
START saveTask
	READ title, due date, priority, status, and description

	IF title or due date is missing THEN
		STOP without saving
	END IF

	IF an existing task is being edited THEN
		UPDATE that task in users/{uid}/tasks
	ELSE
		CREATE a task in users/{uid}/tasks
	END IF

	SET completed based on whether status is Completed
	DISPLAY save feedback
	LET the Firestore listener refresh the task list and progress
END saveTask
```

### 7. Complete or delete a task
```text
START updateTaskStatus
	UPDATE completed and status in the user's Firestore task
	DISPLAY result feedback
END updateTaskStatus

START deleteTask
	ASK the user to confirm deletion

	IF deletion is not confirmed THEN
		STOP
	END IF

	DELETE the selected Firestore task
	DISPLAY result feedback
END deleteTask
```

### 8. Send or cancel a support request
```text
START bookSession
	READ session date, type, and notes

	IF date is in the past OR notes are outside allowed length THEN
		DISPLAY a validation error
		STOP
	END IF

	CREATE a Pending request in users/{uid}/bookings
	DISPLAY that the request was saved, not yet confirmed
END sendSupportRequest

START cancelSupportRequest
	ASK the learner to confirm cancellation
	DELETE the selected request from users/{uid}/bookings
	DISPLAY result feedback
END cancelSupportRequest
```

### 9. Play the learning challenge
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

### 10. Print progress summary
```text
START printProgress
	CALCULATE completed tasks, outstanding tasks, and completion percentage
	OPEN the browser print dialog
END printProgress
```

## School administration scope

The current application is a learner portal: each authenticated learner can manage their own tasks and send/cancel their own support requests. It does not yet provide staff accounts, task assignment, or an in-app staff workflow to confirm support requests; requests remain pending until staff process them separately.

## Authors

Kgodiso Motsepe, Karrel Esterhuizen, Sbusiso Nhlapho