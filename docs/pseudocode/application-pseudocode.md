# Application Pseudocode

## 1. Start Application
```text
START application
    LOAD the correct page
    LOAD required modules
    INITIALISE Firebase
    CHECK authentication state

    IF user is signed in THEN
        LOAD user data
        SHOW protected controls
    ELSE
        SHOW public pages
    END IF

    ATTACH event listeners
END application
```

## 2. Register User
```text
START registerUser
    READ full name, email, and password

    IF name is empty THEN
        DISPLAY "Name is required"
        STOP
    END IF

    IF email is empty THEN
        DISPLAY "Email is required"
        STOP
    END IF

    IF password is empty THEN
        DISPLAY "Password is required"
        STOP
    END IF

    CREATE new user record
    SAVE user profile
    DISPLAY success message
END registerUser
```

## 3. Login User
```text
START loginUser
    READ email and password

    IF email is empty OR password is empty THEN
        DISPLAY validation error
        STOP
    END IF

    ATTEMPT Firebase authentication

    IF authentication succeeds THEN
        REDIRECT to dashboard
    ELSE
        DISPLAY invalid credentials message
    END IF
END loginUser
```

## 4. Create Task
```text
START createTask
    READ task title, due date, and status

    IF title is empty THEN
        DISPLAY "Task title is required"
        STOP
    END IF

    CREATE task object with user ID
    SAVE task to the user's list
    REFRESH task list
END createTask
```
