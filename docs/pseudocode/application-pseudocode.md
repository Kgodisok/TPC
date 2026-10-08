# Application Pseudocode

## 1. Start Application
```text
START application
    INITIALISE Firebase Authentication and Cloud Firestore
    READ requested page

    IF page is the public landing page THEN
        DISPLAY portal information without fabricated statistics
    ELSE IF page is sign-in or registration THEN
        ATTACH account form handlers
    ELSE IF page is the learner dashboard THEN
        OBSERVE Firebase Authentication state
        IF no authenticated user exists THEN
            REDIRECT to sign-in
        ELSE
            LOAD the user's private profile
            SUBSCRIBE to that user's Firestore tasks and support requests
            ATTACH learner dashboard handlers
        END IF
    END IF
END application
```

## 2. Register User
```text
START registerUser
    READ full name, email, and password
    VALIDATE name, email, and password formats
    IF any value is invalid THEN
        DISPLAY specific validation feedback
        STOP
    END IF

    CREATE Firebase Authentication account
    SET Firebase display name
    CREATE private profile at users/{uid}
    DISPLAY account-created feedback
    REDIRECT to learner dashboard
ON ERROR
    DISPLAY actionable Firebase error feedback
END registerUser
```

## 3. Sign In and Sign Out
```text
START signIn
    READ email and password
    SIGN IN with Firebase Authentication
    IF sign-in succeeds THEN
        REDIRECT to learner dashboard
    ELSE
        DISPLAY an actionable error
    END IF
END signIn

START signOut
    SIGN OUT with Firebase Authentication
    STOP user-specific Firestore listeners
    REDIRECT to public landing page
END signOut
```

## 4. Load Tasks and Progress
```text
START loadLearnerTasks
    SUBSCRIBE to users/{uid}/tasks
    WHEN Firestore task data changes
        DISPLAY tasks
        COUNT completed and outstanding tasks
        CALCULATE completion percentage
    END WHEN
END loadLearnerTasks
```

## 5. Manage Tasks
```text
START saveTask
    READ title, due date, priority, status, and description
    VALIDATE required fields and length limits
    IF editing THEN
        UPDATE the task in users/{uid}/tasks/{taskId}
    ELSE
        CREATE a task in users/{uid}/tasks
    END IF
    DISPLAY save result
END saveTask

START toggleTask
    UPDATE completed and status in the selected Firestore task
    DISPLAY update result
END toggleTask

START deleteTask
    ASK the learner to confirm
    IF confirmed THEN
        DELETE the selected Firestore task
    END IF
END deleteTask
```

## 6. Filter Tasks
```text
START filterTasks
    COPY tasks from the current Firestore snapshot
    APPLY title/description search
    APPLY selected completion filter
    SORT by creation date, due date, or priority
    DISPLAY matching tasks or the empty state
END filterTasks
```

## 7. Manage Support Requests
```text
START sendSupportRequest
    READ date, support type, and notes
    REJECT past dates and invalid note lengths
    CREATE a Pending request in users/{uid}/bookings
    DISPLAY that the request was saved for school follow-up
END sendSupportRequest

START cancelSupportRequest
    ASK the learner to confirm cancellation
    DELETE the selected request from Firestore
END cancelSupportRequest
```

## 8. Learning Challenge and Print
```text
START learningChallenge
    DISPLAY questions one at a time
    CHECK each selected answer and update score
    DISPLAY feedback and final result
END learningChallenge

START printProgress
    CALCULATE progress from the current task snapshot
    OPEN the browser print dialog
END printProgress
```

All learner documents are scoped to the authenticated user's UID. The portal does not yet include school staff accounts or an in-app workflow for assigning tasks or confirming support requests.
