
Figma Design Project:
https://www.figma.com/make/qGsRICJkncdDbpPOQC8vBm/Learner-Dashboard?t=IQ8KSbTfO6x7GYZc-1

SkillsTrack Learner Support Portal

About the Project

The SkillsTrack Learner Support Portal is a web application we are building as part of the JavaScript Programmer programme.

The main idea is simple: instead of learners keeping track of tasks, support bookings and progress in different places, the portal brings these activities together in one application.

A learner should be able to:

create an account and log in;

manage learning tasks;

book a support session;

see their progress;

search, filter and sort tasks or resources;

save a simple preference such as a theme;

print a progress summary; and

play a small JavaScript-based game.

The project uses HTML, CSS, JavaScript, Firebase and GitHub. The project brief requires Firebase Realtime Database, Firebase Authentication, REST API communication, Git/GitHub collaboration, testing, debugging, object-oriented JavaScript and other JavaScript features.

Repository Structure

This is the current structure of the repository shown during development:

TPC/
├── backend/
│   ├── app.js
│   ├── auth.js
│   ├── database.js
│   ├── firebase.js
│   ├── landingPage.js
│   └── ui.js
│
└── public/
    ├── dashboard.html
    ├── index.html
    ├── login.html
    ├── images/
    └── styles/
    
The project may grow as more features are added. When new files are created, they should be placed where they make sense so that the project stays easy to understand and maintain.

Main Features

The portal is expected to include the following features:

Authentication – registration, login, logout and checking whether a user is signed in.

Dashboard – show total tasks, completed tasks, outstanding tasks and progress.

Task Manager – create, read, update and delete tasks.

Support Bookings – allow learners to request a support session and receive useful feedback.

Search / Filter / Sort – help users find tasks or resources more easily.

Cookie Preference – save a non-sensitive setting such as a theme or display mode.

Confirmation Dialog – ask the user to confirm before deleting something.

Print Summary – allow the learner to print a progress summary.

Animation – include at least one animation controlled by JavaScript timers.

Multimedia – include a controlled audio, image or video element.

Mini-game – include a simple playable game using an approved JavaScript framework or library.

Firebase + REST – store and manage project data through Firebase and documented REST requests.

These features are based on the minimum application requirements in the project brief.

Firebase Data Structure

The project brief suggests the following Firebase structure. We can adjust it if the team and assessor approve the changes.

users/{uid}
    displayName
    email
    role
    createdAt

tasks/{taskId}
    userId
    title
    category
    dueDate
    priority
    completed
    createdAt

bookings/{bookingId}
    userId
    topic
    preferredDate
    notes
    status

scores/{scoreId}
    userId
    score
    duration
    completedAt

resources/{resourceId}
    title
    type
    url
    description

Passwords must be handled by Firebase Authentication. They should not be stored in the database, cookies or source code. Firebase rules should also prevent users from accessing data they are not allowed to access.

Pseudocode

The pseudocode below is our plan for how the main parts of the application should work. It is not the final JavaScript code. We will use it as a guide when implementing and testing each feature.

1. Start the Application

START application

    LOAD the required page
    LOAD the JavaScript modules
    INITIALISE Firebase
    CHECK whether a user is signed in

    IF the user is signed in THEN
        LOAD the user's information
        SHOW the features the user is allowed to use
    ELSE
        SHOW the public pages
    END IF

    SET up event listeners
    LOAD the saved theme or other preference

END application

2. Register a New User

START registerUser


START registerUser

    GET name from the name input field
    GET email from the email input field
    GET password from the password input field

    REMOVE unnecessary spaces from name
    REMOVE unnecessary spaces from email

    IF name is empty
        DISPLAY "Name is required"
        STOP
    END IF

    IF name contains numbers or special characters
        DISPLAY "Name must contain letters only"
        STOP
    END IF

    IF email is empty
        DISPLAY "Email is required"
        STOP
    END IF

    IF email does not contain a valid email format
        DISPLAY "Please enter a valid email address"
        STOP
    END IF

    IF password is empty
        DISPLAY "Password is required"
        STOP
    END IF

    IF password is less than 8 characters
        DISPLAY "Password must contain at least 8 characters"
        STOP
    END IF

    IF password does not contain a number
        DISPLAY "Password must contain at least one number"
        STOP
    END IF

    IF password does not contain a special character
        DISPLAY "Password must contain at least one special character"
        STOP
    END IF

    CREATE a user object using name, email and password

    ADD the user object to the users array

    CLEAR the name input field
    CLEAR the email input field
    CLEAR the password input field

    DISPLAY "Registration successful"

END registerUser



3. Log In

START loginUser

    GET the value from the email input field
    GET the value from the password input field

    REMOVE unnecessary spaces from the beginning and end of the email

    IF email is empty
        DISPLAY "Email is required"
        STOP
    END IF

    IF password is empty
        DISPLAY "Password is required"
        STOP
    END IF

    IF email does not match a valid email format
        DISPLAY "Please enter a valid email address"
        STOP
    END IF

    DISPLAY the loading state

    TRY

        SEND the email and password to Firebase Authentication

        IF Firebase Authentication confirms the email and password are correct
            STORE the authenticated user's session/state
            REDIRECT the user to the dashboard
        ELSE
            DISPLAY "Invalid email or password"
        END IF

    CATCH authentication error

        IF the error means the email or password is incorrect
            DISPLAY "Invalid email or password"
        ELSE IF the error means too many login attempts
            DISPLAY "Too many attempts. Please try again later"
        ELSE
            DISPLAY "Something went wrong. Please try again"
        END IF

    FINALLY

        REMOVE the loading state

END loginUser


4. Check Authentication State


START checkAuthenticationState

    GET the current authentication state from Firebase

    IF a user is currently signed in THEN

        GET the authenticated user's UID
        GET the authenticated user's email

        SET authentication status to "authenticated"

        RETURN the authenticated user's information

    ELSE

        SET authentication status to "not authenticated"

        RETURN no authenticated user

    END IF

END checkAuthenticationState


5.
START monitorAuthentication

    LISTEN for changes to the Firebase Authentication state

    WHEN the authentication state changes:

        GET the currently authenticated user

        IF a user is signed in THEN

            GET the user's unique UID from Firebase Authentication

            USE the UID to find the user's profile in the database

            LOAD the user's name, email and other profile information

            STORE the authenticated user's information in the application state

            ALLOW the user to access protected pages and features

            HIDE the login and registration options

        ELSE

            REMOVE the authenticated user's information from the application state

            BLOCK access to protected pages and features

            SHOW the login and registration options

            IF the user attempts to access a protected page THEN
                REDIRECT the user to the login page
            END IF

        END IF

END monitorAuthentication


5. Create a Task


START createTask

    GET the value from the task title input field
    GET the selected category from the category input field
    GET the selected due date from the due date input field
    GET the selected priority from the priority input field

    GET the currently authenticated user's UID from Firebase Authentication

    IF task title is empty THEN
        DISPLAY "Task title is required"
        STOP
    END IF

    IF category is empty THEN
        DISPLAY "Please select a category"
        STOP
    END IF

    IF due date is empty THEN
        DISPLAY "Due date is required"
        STOP
    END IF

    IF priority is empty THEN
        DISPLAY "Please select a priority"
        STOP
    END IF

    IF no user is currently authenticated THEN
        DISPLAY "Please log in before creating a task"
        STOP
    END IF

    IF due date is earlier than the current date THEN
        DISPLAY "Due date cannot be in the past"
        STOP
    END IF

    CREATE a new task object

    SET task.title = task title
    SET task.category = selected category
    SET task.dueDate = selected due date
    SET task.priority = selected priority
    SET task.userId = current user's UID
    SET task.completed = false
    SET task.createdAt = current date and time

    DISPLAY the loading state

    TRY

        SEND the task object to Firebase

        IF Firebase successfully saves the task THEN

            CLEAR the task title input field
            RESET the category selection
            RESET the due date input field
            RESET the priority selection

            LOAD the user's tasks from Firebase

            DISPLAY "Task created successfully"

        ELSE

            DISPLAY "Unable to create task"

        END IF

    CATCH error

        DISPLAY "Something went wrong while creating the task. Please try again"

    FINALLY

        REMOVE the loading state

END createTask


START loadTasks

    GET the currently authenticated user from Firebase Authentication

    IF no user is currently authenticated THEN
        DISPLAY "Please log in to view your tasks"
        STOP
    END IF

    GET the authenticated user's UID

    DISPLAY the task loading indicator

    TRY

        SEND a request to Firebase to retrieve the tasks

        RECEIVE the task data from Firebase

        CREATE an empty tasks array

        FOR EACH task received from Firebase

            IF task.userId is equal to the current user's UID THEN
                ADD the task to the tasks array
            END IF

        END FOR

        SAVE the filtered tasks in the application's tasks array

        CALL renderTasks with the tasks array

        CALL calculateProgress using the tasks array

    CATCH error

        LOG the technical error for debugging
        DISPLAY "Unable to load your tasks. Please try again"

    FINALLY

        REMOVE the task loading indicator

END loadTasks


START updateTask

    GET the ID of the task selected by the user

    FIND the selected task using its task ID

    IF the selected task does not exist THEN
        DISPLAY "Task could not be found"
        STOP
    END IF

    GET the updated task title
    GET the updated category
    GET the updated due date
    GET the updated priority
    GET the updated completed status

    REMOVE unnecessary spaces from the task title

    IF task title is empty THEN
        DISPLAY "Task title is required"
        STOP
    END IF

    IF category is empty THEN
        DISPLAY "Please select a category"
        STOP
    END IF

    IF due date is empty THEN
        DISPLAY "Due date is required"
        STOP
    END IF

    IF priority is empty THEN
        DISPLAY "Please select a priority"
        STOP
    END IF

    IF no user is currently authenticated THEN
        DISPLAY "Please log in before updating a task"
        STOP
    END IF

    GET the current user's UID

    IF selected task.userId is not equal to current user's UID THEN
        DISPLAY "You are not allowed to update this task"
        STOP
    END IF

    DISPLAY the loading state

    TRY

        CREATE an updated task object

        SET updatedTask.title = updated task title
        SET updatedTask.category = updated category
        SET updatedTask.dueDate = updated due date
        SET updatedTask.priority = updated priority
        SET updatedTask.completed = updated completed status

        SEND the updated task to Firebase using PUT or PATCH

        IF Firebase successfully updates the task THEN

            UPDATE the task in the local tasks array

            CALL renderTasks with the updated tasks array

            CALL calculateProgress using the updated tasks array

            DISPLAY "Task updated successfully"

        ELSE

            DISPLAY "Unable to update the task"

        END IF

    CATCH error

        LOG the technical error for debugging
        DISPLAY "Something went wrong while updating the task"

    FINALLY

        REMOVE the loading state

END updateTask


START deleteTask

    GET the ID of the task selected by the user

    FIND the selected task in the tasks array

    IF the selected task does not exist THEN
        DISPLAY "Task could not be found"
        STOP
    END IF

    GET the currently authenticated user's UID

    IF selected task.userId is not equal to current user's UID THEN
        DISPLAY "You are not allowed to delete this task"
        STOP
    END IF

    DISPLAY "Are you sure you want to delete this task?"

    ASK the user to confirm the deletion

    IF the user chooses CANCEL THEN
        STOP
    END IF

    DISPLAY the loading state

    TRY

        SEND a DELETE request to Firebase using the selected task ID

        IF Firebase successfully deletes the task THEN

            REMOVE the selected task from the local tasks array

            CALL renderTasks with the updated tasks array

            CALL calculateProgress using the updated tasks array

            DISPLAY "Task deleted successfully"

        ELSE

            DISPLAY "Unable to delete the task"

        END IF

    CATCH error

        LOG the technical error for debugging
        DISPLAY "Something went wrong while deleting the task"

    FINALLY

        REMOVE the loading state

END deleteTask



START calculateProgress

    GET the current user's UID

    IF there is no authenticated user THEN
        SET totalTasks = 0
        SET completedTasks = 0
        SET outstandingTasks = 0
        SET progressPercentage = 0
        STOP
    END IF

    GET all tasks belonging to the current user

    COUNT the number of tasks
    SET totalTasks to the total number of tasks

    IF totalTasks is equal to 0 THEN

        SET completedTasks = 0
        SET outstandingTasks = 0
        SET progressPercentage = 0

        DISPLAY "No tasks available"

        STOP

    END IF

    SET completedTasks = 0

    FOR EACH task in the user's tasks

        IF task.completed is equal to true THEN
            INCREASE completedTasks by 1
        END IF

    END FOR

    CALCULATE outstandingTasks as:

        totalTasks minus completedTasks

    CALCULATE progressPercentage as:

        completedTasks divided by totalTasks multiplied by 100

    DISPLAY totalTasks
    DISPLAY completedTasks
    DISPLAY outstandingTasks
    DISPLAY progressPercentage

END calculateProgress



START searchTasks(searchTerm)

    GET the current tasks array

    CONVERT searchTerm to lowercase

    REMOVE unnecessary spaces from searchTerm

    IF searchTerm is empty THEN
        CALL renderTasks with the complete tasks array
        STOP
    END IF

    CREATE an empty matchingTasks array

    FOR EACH task in the tasks array

        CONVERT task.title to lowercase
        CONVERT task.category to lowercase

        IF task.title contains searchTerm
            OR task.category contains searchTerm THEN

            ADD the task to matchingTasks

        END IF

    END FOR

    IF matchingTasks is empty THEN
        DISPLAY "No tasks found"
    ELSE
        CALL renderTasks with matchingTasks
    END IF

END searchTasks



START filterTasks(status)

    GET the current tasks array

    IF status is equal to "completed" THEN

        CREATE a filteredTasks array

        KEEP only tasks where task.completed is true

    ELSE IF status is equal to "outstanding" THEN

        CREATE a filteredTasks array

        KEEP only tasks where task.completed is false

    ELSE IF status is equal to "all" THEN

        SET filteredTasks equal to the complete tasks array

    ELSE

        DISPLAY "Invalid filter selected"
        STOP

    END IF

    CALL renderTasks with filteredTasks

END filterTasks


START sortTasks

    GET the selected sorting option

    GET the current tasks array

    IF sorting option is "title" THEN

        SORT tasks alphabetically by task.title

    ELSE IF sorting option is "dueDate" THEN

        SORT tasks from earliest due date to latest due date

    ELSE IF sorting option is "priority" THEN

        SORT tasks according to priority

        ORDER priority as:
            High
            Medium
            Low

    ELSE

        DISPLAY "Invalid sorting option"
        STOP

    END IF

    CALL renderTasks with the sorted tasks

END sortTasks


START renderTasks(tasks)

    SELECT the task list container from the webpage

    CLEAR all existing task elements from the task list

    IF tasks array is empty THEN
        DISPLAY "No tasks found"
        STOP
    END IF

    FOR EACH task in the tasks array

        CREATE a task container

        CREATE a title element
        SET the title element text to task.title

        CREATE a category element
        SET the category element text to task.category

        CREATE a due date element
        SET the due date element text to task.dueDate

        CREATE a priority element
        SET the priority element text to task.priority

        CREATE a status element

        IF task.completed is true THEN
            SET status text to "Completed"
        ELSE
            SET status text to "Outstanding"
        END IF

        CREATE an edit button
        CREATE a complete button
        CREATE a delete button

        ATTACH the selected task ID to the buttons

        ADD a click event to the edit button
        CALL updateTask when the edit button is clicked

        ADD a click event to the complete button
        TOGGLE the task's completed status when clicked

        ADD a click event to the delete button
        CALL deleteTask when the delete button is clicked

        ADD the title, category, due date, priority and status
        TO the task container

        ADD the edit, complete and delete buttons
        to the task container

        ADD the completed task container to the task list

    END FOR

END renderTasks


START bookSupportSession

    GET the value from the support topic input field
    GET the selected preferred date
    GET the notes from the notes input field

    GET the currently authenticated user

    IF no user is currently authenticated THEN
        DISPLAY "Please log in before booking a support session"
        STOP
    END IF

    GET the authenticated user's UID

    REMOVE unnecessary spaces from the topic
    REMOVE unnecessary spaces from the notes

    IF topic is empty THEN
        DISPLAY "Support topic is required"
        STOP
    END IF

    IF preferred date is empty THEN
        DISPLAY "Please select a preferred date"
        STOP
    END IF

    IF preferred date is earlier than the current date THEN
        DISPLAY "Please select a future date"
        STOP
    END IF

    CREATE a booking object

    SET booking.userId = current user's UID
    SET booking.topic = topic
    SET booking.preferredDate = preferred date
    SET booking.notes = notes
    SET booking.status = "pending"
    SET booking.createdAt = current date and time

    DISPLAY the booking loading state

    TRY

        SAVE the booking object in Firebase

        IF Firebase successfully saves the booking THEN

            CLEAR the topic input
            CLEAR the preferred date input
            CLEAR the notes input

            DISPLAY "Support session booked successfully"

        ELSE

            DISPLAY "Unable to book the support session"

        END IF

    CATCH error

        LOG the technical error for debugging
        DISPLAY "Something went wrong while booking your session"

    FINALLY

        REMOVE the booking loading state

END bookSupportSession


START savePreference

    GET the theme selected by the user

    IF selected theme is "dark" THEN
        SET preference = "dark"
    ELSE IF selected theme is "light" THEN
        SET preference = "light"
    ELSE
        SET preference = "light"
    END IF

    CREATE a cookie named "theme"

    SET the cookie value to the selected preference

    SET the cookie expiry time

    SET the cookie path to "/"

END savePreference

START loadPreference

    READ the cookies stored by the browser

    SEARCH for a cookie named "theme"

    IF the "theme" cookie exists THEN

        GET the saved theme value

        IF saved theme is "dark" THEN
            APPLY dark theme to the webpage

        ELSE IF saved theme is "light" THEN
            APPLY light theme to the webpage

        END IF

    ELSE

        SET the theme to the default theme

    END IF

END loadPreference


START printProgressSummary

    GET the current user's tasks

    COUNT the total number of tasks

    COUNT the number of completed tasks

    CALCULATE outstanding tasks

    IF total tasks is greater than 0 THEN
        CALCULATE progress percentage
    ELSE
        SET progress percentage to 0
    END IF

    CREATE a progress summary containing:

        Total tasks
        Completed tasks
        Outstanding tasks
        Progress percentage

    DISPLAY the progress summary in the print section

    OPEN the browser print dialog

END printProgressSummary


START animateElement

    SELECT the HTML element that needs to be animated

    SET the element's starting position

    SET the element's starting size or opacity

    SET the animation duration

    SET the animation start time

    START a repeated animation update

    WHILE the animation duration has not finished

        CALCULATE how much time has passed

        CALCULATE the current animation progress

        UPDATE the element's position, size or opacity

        REQUEST the next animation frame

    END WHILE

    SET the element to its final position or state

    STOP the animation

END animateElement


START multimediaControl

    SELECT the audio or video element

    SELECT the PLAY button

    SELECT the PAUSE button

    WHEN the user clicks the PLAY button

        CHECK whether the media is currently paused

        IF the media is paused THEN
            START playing the media
        END IF

    END WHEN

    WHEN the user clicks the PAUSE button

        CHECK whether the media is currently playing

        IF the media is playing THEN
            PAUSE the media
        END IF

    END WHEN

END multimediaControl


START game

    INITIALISE the approved JavaScript game library

    CREATE the game container

    SET the initial score to 0

    SET the game state to "running"

    CREATE the required game objects

    WHILE game state is "running"

        READ keyboard, mouse or touch input from the player

        UPDATE the position of the player's game object

        UPDATE the position of other game objects

        CHECK whether the player has collided with another object

        CHECK whether the player has completed the required objective

        IF the player earns points THEN
            INCREASE the score
        END IF

        IF the player loses or completes the game THEN
            SET game state to "finished"
        END IF

        UPDATE the game display

    END WHILE

    DISPLAY "Game Over"

    DISPLAY the player's final score

    GET the current user's UID

    IF a user is authenticated THEN

        CREATE a score object

        SET score.userId = current user's UID
        SET score.score = final score
        SET score.createdAt = current date and time

        TRY

            SAVE the score object to Firebase

        CATCH error

            LOG the technical error
            DISPLAY "Your score could not be saved"

        END TRY

    END IF

END game


START operation

    DISPLAY the loading state

    TRY

        VALIDATE all required user input

        IF required information is missing THEN
            CREATE a validation error
            THROW the validation error
        END IF

        SEND the request to the required service

        RECEIVE the response

        IF the response indicates failure THEN
            THROW an operation error
        END IF

        PROCESS the successful response

    CATCH error

        LOG the technical error details for debugging

        IF the error is caused by invalid user input THEN
            DISPLAY the specific validation message

        ELSE IF the error is caused by authentication THEN
            DISPLAY "Please log in and try again"

        ELSE IF the error is caused by the server or Firebase THEN
            DISPLAY "The service is currently unavailable. Please try again later"

        ELSE
            DISPLAY "Something went wrong. Please try again"

        END IF

    FINALLY

        REMOVE the loading state

        ENABLE the required buttons and inputs

        MAKE SURE the user interface is usable again

    END TRY

END operation


START CLASS Task

    DEFINE PROPERTY id
    DEFINE PROPERTY title
    DEFINE PROPERTY category
    DEFINE PROPERTY dueDate
    DEFINE PROPERTY priority
    DEFINE PROPERTY userId
    DEFINE PROPERTY completed
    DEFINE PROPERTY createdAt

    CONSTRUCTOR(id, title, category, dueDate, priority, userId)

        SET this.id = id
        SET this.title = title
        SET this.category = category
        SET this.dueDate = dueDate
        SET this.priority = priority
        SET this.userId = userId

        SET this.completed = false

        SET this.createdAt = current date and time

    END CONSTRUCTOR


    METHOD markComplete

        SET this.completed = true

    END METHOD


    METHOD markIncomplete

        SET this.completed = false

    END METHOD


    METHOD toggleComplete

        IF this.completed is true THEN
            SET this.completed = false
        ELSE
            SET this.completed = true
        END IF

    END METHOD


    METHOD updateTask(title, category, dueDate, priority)

        SET this.title = title
        SET this.category = category
        SET this.dueDate = dueDate
        SET this.priority = priority

    END METHOD

END CLASS


Example:

CREATE a new Task object using a title and due date

The project brief requires planned object-oriented design and later implementation using ES6 classes, objects and relationships.

REST API Plan

We will use REST requests to communicate with Firebase. The basic plan is:

Method

What it does

Example in this project

POST

Creates new data

Create a task or booking

GET

Reads data

Load a user's tasks

PUT / PATCH

Updates data

Edit a task or mark it complete

DELETE

Removes data

Delete a task

The project brief specifically requires documented REST operations including GET, POST, PUT or PATCH, and DELETE.

Git and GitHub Workflow

Because this is a team project, we need to be careful about how we work with Git and GitHub. The main idea is that everyone works on their own feature branch and then brings the work into main through a pull request.

Pick an issue / task
        ↓
Create a feature branch
        ↓
Write the code
        ↓
Test the changes
        ↓
Commit the work
        ↓
Push the branch to GitHub
        ↓
Open a Pull Request
        ↓
Peer review
        ↓
Make any required changes
        ↓
Merge into main
        ↓
Pull the latest changes

We should avoid making all changes directly on main. Each team member should make meaningful commits and be able to explain the work they contributed. The brief also requires branches, pull requests, reviews, merges and evidence of collaboration.

Testing Plan

Testing will be done throughout development rather than only at the end. Some of the main tests we need to cover are:

[ ] Register with valid information
[ ] Register with missing information
[ ] Register with an invalid email
[ ] Test a numeric boundary value
[ ] Log in with correct details
[ ] Try logging in with incorrect details
[ ] Log out
[ ] Create a task
[ ] View tasks
[ ] Edit a task
[ ] Mark a task as complete
[ ] Delete a task and confirm the deletion
[ ] Cancel a deletion
[ ] Check the empty-task state
[ ] Check progress calculations
[ ] Search tasks
[ ] Filter tasks
[ ] Sort tasks
[ ] Book a support session
[ ] Test cookie preference
[ ] Print the progress summary
[ ] Test redirects
[ ] Test the JavaScript animation
[ ] Test multimedia controls
[ ] Play the mini-game
[ ] Save the game score
[ ] Test Firebase/REST errors
[ ] Test authentication state

The assessment requires testing and debugging evidence, including at least three issues that are identified, corrected and tested again.

Security Notes

A few security rules are especially important for this project:

Passwords must only be handled through Firebase Authentication.

Passwords must not be saved in Firebase Realtime Database, cookies or source code.

Private credentials and service-account files must never be pushed to GitHub.

User input must be checked before it is stored in Firebase.

Firebase Security Rules should stop unauthorised users from reading or changing protected data.

These requirements are part of the project brief.

What We Want to Achieve

By the end of the project, the goal is to have a working portal that is easy for a learner to use and easy for another developer or assessor to understand.

The code should be organised, tested and readable. More importantly, every team member should understand the parts they worked on and be able to explain how the application works. The assessment is individual even though the application is developed as a team.

Technologies

HTML5

CSS3

JavaScript (ES6+)

Firebase Authentication

Firebase Realtime Database

Firebase REST API

Git

GitHub

An assessor-approved JavaScript library/framework for the mini-game

The required technology and evidence are listed in the project brief.

Project Reference

This README is based on the supplied JavaScript Programmer – Two-Month Integrated Project brief for the SkillsTrack Learner Support Portal. The brief covers the application requirements, Firebase data structure, REST communication, JavaScript development, GitHub collaboration, testing and the two-month assessment deliverables.

## Month 1 Deliverables Evidence

### Problem Statement, Scope and Client Requirements

Learners currently need to track learning tasks, support bookings and progress across separate tools. SquareSchools provides one learner portal for these activities.

In scope: account registration and login, task CRUD operations, progress totals, support-session requests, resource access, task search/filter/sort, a saved display preference, deletion confirmation, a printable progress summary, Firebase Authentication, Firebase Realtime Database and REST communication.

Out of scope: staff administration, payment processing, replacing an institution's learning-management system, and storing passwords outside Firebase Authentication.

Client requirements are to provide a clear learner workflow, protect user data, use Firebase and REST, demonstrate JavaScript fundamentals and object-oriented design, and maintain evidence of collaboration, testing and review.

### User Stories and Acceptance Criteria

1. As a learner, I want to register and log in so that I can access my portal securely.
    - Valid details create an account and redirect to the dashboard.
    - Missing or invalid details show a clear validation message.
    - A signed-out user cannot use protected dashboard features.
2. As a learner, I want to create and view tasks so that I can organise my work.
    - A task requires a title and valid input before it is saved.
    - A saved task displays its title, category, due date, priority and status.
    - Tasks are associated with the signed-in user's UID.
3. As a learner, I want to edit and complete a task so that my task list stays current.
    - Editing replaces the selected task's values without changing its owner.
    - Completing a task changes its status to completed.
    - The updated state remains after the task list is reloaded.
4. As a learner, I want to delete a task safely so that I do not remove it accidentally.
    - Selecting delete opens a confirmation dialog.
    - Cancel leaves the task unchanged.
    - Confirm removes the task and refreshes totals.
5. As a learner, I want to see my progress so that I know how much work remains.
    - Total, completed and outstanding counts are displayed.
    - Progress is completed tasks divided by total tasks.
    - An empty task list displays zero progress without an error.
6. As a learner, I want to search, filter and sort tasks so that I can find work quickly.
    - Search matches task titles or categories.
    - Completed, outstanding and all-task filters work correctly.
    - The selected sort order changes display order without changing stored data.

### Programming Life-cycle Plan

| Stage | Month 1 activity and evidence |
| --- | --- |
| Analysis | Identify learner problems, client requirements, scope and user stories. |
| Design | Produce navigation, pseudocode, Firebase model, REST plan and class relationships. |
| Coding | Build the HTML shell, CSS layout, JavaScript modules, authentication and task features. |
| Testing | Run automated unit tests and manual acceptance checks for normal, invalid and boundary inputs. |
| Implementation review | Demonstrate the current build, review issues with the team/assessor and record feedback. |
| Improvement | Prioritise feedback, correct defects, retest and record changes in project history. |

### Object Design and Relationships

```text
User 1 -------- owns -------- * Task
User 1 -------- creates ----- * Booking
```

`User` represents the authenticated learner. `Task` represents one learner task. `Booking` represents a support request. A `User` can own many `Task` and `Booking` objects; every task and booking belongs to one user through `userId`.

```javascript
class User {
     constructor(uid, displayName, email) {
          this.uid = uid;
          this.displayName = displayName;
          this.email = email;
          this.tasks = [];
          this.bookings = [];
     }
}

class Task {
     constructor(title, dueDate, userId) {
          this.title = title;
          this.dueDate = dueDate;
          this.userId = userId;
          this.completed = false;
     }

     markComplete() {
          this.completed = true;
     }
}
```

### IDE Configuration

The repository contains VS Code settings in `.vscode/` for a consistent JavaScript formatter, ESLint validation and Node debugging. The CI workflow runs the same test command used locally.

### Testing and Debugging Record

| Issue | Correction | Retest evidence |
| --- | --- | --- |
| Empty login fields were accepted by the form handler. | Added trimmed-field validation and an error message. | Manual login check confirms the message is shown. |
| The root URL did not select the login page. | Added the Express redirect from `/` to `/login.html`. | A running server request to `/` returns a redirect. |
| Progress could divide by zero with no tasks. | Defined the empty-list result as zero counts and progress. | Automated progress tests cover empty and normal totals. |

Update this record with dates, screenshots and tester names after each demonstration.

### Assessor Review and Month 1 Reflection

#### Assessor review record

- Review date: To be completed during assessor review
- Assessor: To be completed
- Feedback: To be completed
- Agreed actions: To be completed
- Retest/review date: To be completed

#### Month 1 reflection

Each team member must record their contribution, learning, strongest requirement, remaining gap and Month 2 improvement actions. This section remains a template until the team and assessor provide those records.