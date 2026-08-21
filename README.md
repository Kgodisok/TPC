
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

    GET name from the form
    GET email from the form
    GET password from the form

    VALIDATE the name
    VALIDATE the email
    VALIDATE the password

    IF any input is invalid THEN
        SHOW the validation error
        STOP
    END IF

    TRY
        CREATE the Firebase Authentication account
        GET the new user's UID
        CREATE the user's profile in Firebase
        SAVE name, email, role and created date
        SHOW a success message

    CATCH error
        SHOW a registration error message

    FINALLY
        REMOVE the loading message
    END TRY

END registerUser

3. Log In

START loginUser

    GET email
    GET password

    IF email is empty OR password is empty THEN
        SHOW "Please complete all required fields"
        STOP
    END IF

    CHECK that the email format is valid

    TRY
        SEND the login request to Firebase Authentication

        IF login is successful THEN
            KEEP the authenticated user state
            REDIRECT the user to the dashboard
        ELSE
            SHOW a login error
        END IF

    CATCH error
        SHOW a user-friendly error message

    FINALLY
        REMOVE the loading state
    END TRY

END loginUser

4. Check Authentication State

START monitorAuthentication

    LISTEN for changes in Firebase authentication

    IF a user is signed in THEN
        GET the user's UID
        LOAD the user's profile
        ALLOW access to protected features
    ELSE
        BLOCK protected features
        SEND the user to the login page when necessary
    END IF

END monitorAuthentication

5. Create a Task

START createTask

    GET task title
    GET category
    GET due date
    GET priority
    GET the current user's UID

    VALIDATE the required fields

    IF validation fails THEN
        SHOW the validation error
        STOP
    END IF

    CREATE a task object
    SET task.userId = current user's UID
    SET task.completed = false
    SET task.createdAt = current date and time

    TRY
        SEND the task to Firebase using POST
        CLEAR the form
        LOAD the tasks again
        SHOW a success message

    CATCH error
        SHOW a task creation error
    END TRY

END createTask

6. Load Tasks

START loadTasks

    GET the current user's UID
    SHOW a loading message

    TRY
        SEND a GET request to Firebase
        RECEIVE the task data

        KEEP only tasks belonging to the current user
        SAVE the tasks in an array
        DISPLAY the tasks on the page

    CATCH error
        SHOW an error message

    FINALLY
        REMOVE the loading message
    END TRY

END loadTasks

7. Update a Task

START updateTask

    GET the selected task ID
    GET the updated values
    VALIDATE the values

    IF the values are not valid THEN
        SHOW the validation error
        STOP
    END IF

    TRY
        SEND a PUT or PATCH request to Firebase
        REFRESH the task list
        SHOW a success message

    CATCH error
        SHOW an update error
    END TRY

END updateTask

8. Delete a Task

START deleteTask

    GET the selected task ID

    ASK the user to confirm the deletion

    IF the user chooses CANCEL THEN
        STOP
    END IF

    TRY
        SEND a DELETE request to Firebase
        REMOVE the task from the page
        RECALCULATE progress
        SHOW a success message

    CATCH error
        SHOW a deletion error
    END TRY

END deleteTask

9. Calculate Progress

START calculateProgress

    GET all tasks for the current user

    IF there are no tasks THEN
        completed = 0
        outstanding = 0
        progress = 0
        SHOW "No tasks available"
        STOP
    END IF

    COUNT how many tasks are completed
    COUNT the total number of tasks
    CALCULATE outstanding tasks
    CALCULATE progress percentage

    DISPLAY total tasks
    DISPLAY completed tasks
    DISPLAY outstanding tasks
    DISPLAY progress percentage

END calculateProgress

10. Search Tasks

START searchTasks(searchTerm)

    GET the tasks array

    FILTER the tasks
    KEEP tasks where the title or category contains searchTerm

    DISPLAY the matching tasks

END searchTasks

11. Filter Tasks

START filterTasks(status)

    IF status = "completed" THEN
        SHOW tasks where completed = true

    ELSE IF status = "outstanding" THEN
        SHOW tasks where completed = false

    ELSE
        SHOW all tasks
    END IF

END filterTasks

12. Sort Tasks

START sortTasks

    GET the selected sort option

    SORT the tasks by the selected field
    EXAMPLES: title, dueDate or priority

    DISPLAY the sorted tasks

END sortTasks

13. Display Tasks on the Page

START renderTasks(tasks)

    CLEAR the current task list

    FOR EACH task
        CREATE a task container
        CREATE the title element
        CREATE the status element
        CREATE the edit button
        CREATE the complete button
        CREATE the delete button

        PUT the task information into the elements
        ADD the task container to the page
    END FOR

END renderTasks

14. Book a Support Session

START bookSupportSession

    GET topic
    GET preferred date
    GET notes
    GET current user's UID

    VALIDATE required fields

    IF validation fails THEN
        SHOW validation errors
        STOP
    END IF

    CREATE a booking object
    SET booking.userId = current user's UID
    SET booking.status = "pending"

    TRY
        SAVE the booking in Firebase
        CLEAR the booking form
        SHOW a success message

    CATCH error
        SHOW a booking error message
    END TRY

END bookSupportSession

15. Save and Load a Cookie Preference

START savePreference

    GET the selected theme or display mode
    SAVE the preference in a cookie
    SET an expiry time and path

END savePreference

START loadPreference

    READ the available cookies

    IF a saved preference exists THEN
        APPLY it to the page
    ELSE
        USE the default preference
    END IF

END loadPreference

16. Print Progress Summary

START printProgressSummary

    CALCULATE the latest progress values
    PREPARE the summary for printing
    OPEN the browser print dialog

END printProgressSummary

17. JavaScript Animation

START animateElement

    SELECT the element to animate
    SET the starting position or state

    REPEAT the animation update at a controlled interval
        CHANGE the position, size or visible state
    UNTIL the animation is finished

    STOP the timer

END animateElement

18. Multimedia Controls

START multimediaControl

    SELECT the audio or video element

    WHEN the user clicks PLAY
        START the media
    END WHEN

    WHEN the user clicks PAUSE
        PAUSE the media
    END WHEN

END multimediaControl

19. Mini-game

START game

    INITIALISE the approved JavaScript game library/framework
    CREATE the game area
    SET the score to 0
    SET the game state

    WHILE the game is running
        READ user input
        UPDATE game objects
        CHECK game conditions
        UPDATE the score
        DISPLAY the updated game state
    END WHILE

    SHOW the final score

    TRY
        SAVE the score and game information to Firebase
    CATCH error
        SHOW a warning that the score could not be saved
    END TRY

END game

20. Error Handling

START operation

    TRY
        VALIDATE the input

        IF required information is missing THEN
            THROW a custom error
        END IF

        SEND the request
        PROCESS the response

    CATCH error
        LOG the technical error for debugging
        SHOW a clear message to the user

    FINALLY
        REMOVE the loading state
        MAKE SURE the interface can still be used
    END TRY

END operation

21. Task Class (Object-Oriented Design)

CLASS Task

    PROPERTY title
    PROPERTY dueDate
    PROPERTY completed

    CONSTRUCTOR(title, dueDate)
        SET this.title = title
        SET this.dueDate = dueDate
        SET this.completed = false
    END CONSTRUCTOR

    METHOD markComplete
        SET this.completed = true
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