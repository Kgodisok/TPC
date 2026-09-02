
# SkillsTrack Learner Support Portal

**Project Repository:** https://github.com/Kgodisok/TPC  
**Figma Design:** https://www.figma.com/design/czKqRoteDn02IGBXWD347v/Login-Page
**Team:** Squad 9 (Karrel, Kgodiso, Sibuiso)  
**Submission Date:** Month 1 Summative Review

---

## 1. PROBLEM ANALYSIS & REQUIREMENTS

### Problem Statement

Learners in the SkillsTrack program currently manage their learning activities (tasks, support sessions, progress tracking) across multiple disconnected platforms. This fragmented approach leads to:
- **Difficulty tracking progress** across different tools
- **Missed deadlines** and forgotten support bookings
- **Lack of unified visibility** into learning status
- **Inefficient task and resource management**

### Solution

The SkillsTrack Learner Support Portal consolidates all learner activities into a single web application, enabling learners to:
- View and manage learning tasks in one place
- Book and track support sessions
- Monitor progress in real-time
- Save personal preferences
- Access learning resources

### Target Users

- **Primary Users:** JavaScript Programmer learners (age 18-60+)
- **Secondary Users:** Support facilitators, assessors
- **User Characteristics:** Variable technical proficiency, diverse learning styles, various time zones

### Scope

**In Scope:**
- User authentication (register, login, logout)
- Task management (CRUD operations)
- Support booking system
- Progress dashboard
- Task search, filter, and sorting
- Theme preference persistence
- Print progress summary
- Mini-game for engagement
- Multimedia elements

**Out of Scope:**
- Mobile app development
- Real-time video conferencing
- Advanced analytics
- Integration with external learning management systems

### Constraints

- **Technical:** Must use Firebase Realtime Database, JavaScript (ES6+), HTML5, CSS3
- **Time:** Month 1 review deadline (submission-ready state)
- **Security:** No sensitive data in browser storage (passwords should not be stored in localStorage for production)
- **Browser Compatibility:** Must work in modern browsers (Chrome, Firefox, Safari, Edge)

### Project Constraints Summary
| Constraint | Details |
|-----------|---------|
| Technology Stack | JavaScript, HTML5, CSS3, Firebase, GitHub |
| Database | Firebase Realtime Database with Authentication |
| Team Size | 3 learners |
| Timeline | 1 month (current), with future months planned |
| Budget | Free tier (Firebase, GitHub, tools) |

---

## 2. USER STORIES & ACCEPTANCE CRITERIA

### User Story 1: Account Creation
**As a** new learner  
**I want to** create an account with my details  
**So that** I can access the SkillsTrack portal and manage my learning activities

**Acceptance Criteria:**
1. [DONE] User can navigate to the registration page
2. [DONE] User can enter full name, username, and password
3. [DONE] System validates that passwords match (confirmation field)
4. [DONE] System stores user credentials securely (encrypted in production)
5. [DONE] User receives success message and is redirected to login
6. [DONE] User cannot create duplicate usernames (future validation)

### User Story 2: User Authentication
**As a** learner  
**I want to** log in with my username and password  
**So that** I can access my personalized dashboard and data

**Acceptance Criteria:**
1.  User can navigate to the login page
2.  User enters username and password
3.  System validates credentials against stored data
4.  User is redirected to dashboard on successful login
5.  Error message displays for incorrect credentials
6.  User session is maintained until logout

### User Story 3: Dashboard Overview
**As a** logged-in learner  
**I want to** see my learning progress at a glance  
**So that** I can understand my current status and what needs attention

**Acceptance Criteria:**
1.  Dashboard displays personalized welcome message
2.  Dashboard shows total tasks count
3.  Dashboard shows completed tasks count
4.  Dashboard shows outstanding tasks count
5.  Dashboard displays progress percentage (completed/total)
6.  Dashboard is protected (only accessible after login)

### User Story 4: Create Task
**As a** learner  
**I want to** create a new learning task  
**So that** I can add activities to my personal task list

**Acceptance Criteria:**
1.  User can access the task creation form
2.  User can enter task title, description, and status
3.  System assigns unique ID and timestamp to task
4.  Task is saved to localStorage (and Firebase in production)
5.  Success message confirms task creation
6.  Task appears immediately in task list

### User Story 5: View All Tasks
**As a** learner  
**I want to** view all my tasks in a list  
**So that** I can see everything I need to do

**Acceptance Criteria:**
1.  User can see all created tasks
2.  Each task displays title, description, and status
3.  Tasks are clearly formatted and organized
4.  Empty state message appears when no tasks exist

### User Story 6: Search & Filter Tasks
**As a** learner  
**I want to** search and filter tasks by status  
**So that** I can quickly find tasks matching my needs

**Acceptance Criteria:**
1.  User can enter search text to find tasks by title
2.  Search is case-insensitive
3.  User can filter tasks by status (Pending, Completed, etc.)
4.  Filters update the displayed task list in real-time
5.  "No tasks found" message displays when no matches

### User Story 7: Update Task Status
**As a** learner  
**I want to** mark a task as complete  
**So that** I can track my progress and stay organized

**Acceptance Criteria:**
1.  User can click "Complete" button on any task
2.  Task status changes to "Completed"
3.  Progress percentage updates immediately
4.  Change is persisted in storage

### User Story 8: Edit Task
**As a** learner  
**I want to** edit task details (title, description)  
**So that** I can correct or update task information

**Acceptance Criteria:**
1.  User can click "Edit" button on any task
2.  Edit dialog or form appears with current task data
3.  User can modify task title and description
4.  Changes are saved and task list updates
5.  Timestamps reflect when task was updated

### User Story 9: Delete Task
**As a** learner  
**I want to** delete a task  
**So that** I can remove tasks that are no longer relevant

**Acceptance Criteria:**
1.  User can click "Delete" button on any task
2.  Confirmation dialog appears before deletion
3.  Task is removed from list after confirmation
4.  Change is persisted in storage
5.  Progress percentage recalculates

### User Story 10: Book Support Session
**As a** learner  
**I want to** book a support session with specific date and reason  
**So that** I can get help when I need it

**Acceptance Criteria:**
1.  User can access the support booking form
2.  User can select a date for the support session
3.  User can enter the reason for support
4.  System validates that both fields are completed
5.  Booking is saved (localStorage currently, Firebase in production)
6.  Success message confirms booking

### User Story 11: Save Theme Preference
**As a** learner  
**I want to** save my preferred theme (dark/light mode)  
**So that** I can have a personalized visual experience

**Acceptance Criteria:**
1.  User can access theme preference option
2.  User can select between light and dark themes
3.  Theme preference is saved in browser cookies
4.  Selected theme persists across sessions
5.  UI updates immediately when theme changes

### User Story 12: Logout
**As a** logged-in learner  
**I want to** log out of my account  
**So that** I can securely end my session

**Acceptance Criteria:**
1.  User can click "Sign Out" button
2.  Session is terminated
3.  User is redirected to login page
4.  Sensitive data is cleared from storage

---

## 3. PROGRAMMING LIFECYCLE PLAN

### Development Phases

#### Phase 1: Planning & Architecture (Week 1)
-  Define requirements and user stories
-  Design Firebase data structure
-  Plan OOP class hierarchy
-  Create wireframes/mockups
- **Deliverables:** Requirements document, architecture diagrams, Firebase schema

#### Phase 2: Foundation & Setup (Week 1-2)
-  Initialize project repository with proper structure
-  Configure GitHub workflow (branches, .gitignore, README)
-  Set up ESLint and code formatting rules
-  Create basic HTML templates (index, login, dashboard, etc.)
-  Configure Firebase project
- **Deliverables:** Project repository, base HTML pages, configured tools

#### Phase 3: Core Authentication (Week 2)
-  Implement user registration form and logic
-  Implement login form and authentication
-  Add session management
-  Create dashboard layout
- **Deliverables:** Working authentication, protected pages

#### Phase 4: Task Management System (Week 2-3)
-  Implement Task and User OOP classes
-  Create task form and CRUD operations
-  Implement search and filter functionality
-  Add progress calculation logic
- **Deliverables:** Functional task manager, working CRUD

#### Phase 5: Features & Polish (Week 3)
-  Implement support booking system
-  Add cookie-based preferences
-  Create mini-game feature
-  Implement print functionality
- **Deliverables:** All core features working

#### Phase 6: Testing & Debugging (Week 4)
-  Unit tests for models (User, Task classes)
-  Integration testing for workflows
-  Debugging with browser DevTools
-  Performance optimization
- **Deliverables:** Test reports, bug fixes, optimization notes

#### Phase 7: Review & Refinement (Week 4)
-  Code quality review
-  Documentation and comments
-  GitHub workflow verification
-  Preparation for assessor review
- **Deliverables:** Final code, documentation, evidence

### Milestones & Review Points

| Milestone | Target Date | Success Criteria |
|-----------|-------------|-----------------|
| Project Setup & Architecture | 1 Sept | Repository ready, tools configured, wireframes approved |
| Authentication Complete | 5 Sept | Login/register working, sessions managed |
| Task Manager MVP | 10 Sept | CRUD operations, search/filter functional |
| All Features Implemented | 15 Sept | Support booking, preferences, game, print all working |
| Testing Complete | 20 Sept | Tests passing, bugs documented and fixed |
| Final Review Prep | 25 Sept | Documentation complete, code polished |
| **Month 1 Submission** | **30 Sept** | **All requirements met, ready for assessment** |

### Iteration Strategy

- **Daily Standups:** Team discusses progress, blockers, next steps
- **Code Review:** Pull requests reviewed before merging to main
- **Testing Cycle:** Test after each feature completion
- **Feedback Loop:** Incorporate learner/assessor feedback continuously

---

## 4. FIREBASE DATA STRUCTURE & CRUD OPERATIONS

### Realtime Database Schema

```
users/
  {uid}/
    displayName: string
    email: string
    username: string
    role: string ("learner" | "facilitator")
    theme: string ("light" | "dark")
    createdAt: timestamp
    lastLogin: timestamp

tasks/
  {taskId}/
    userId: string (reference to users/{uid})
    title: string
    description: string
    category: string
    status: string ("Pending" | "In Progress" | "Completed")
    priority: string ("Low" | "Medium" | "High")
    dueDate: date
    createdAt: timestamp
    updatedAt: timestamp
    completedAt: timestamp (nullable)

bookings/
  {bookingId}/
    userId: string
    date: date
    reason: string
    status: string ("Pending" | "Confirmed" | "Completed" | "Cancelled")
    createdAt: timestamp

support_sessions/
  {sessionId}/
    userId: string
    facilitatorId: string
    topic: string
    notes: string
    scheduledFor: timestamp
    completedAt: timestamp (nullable)
    feedback: string (nullable)
```

### CRUD Operations Documentation

#### CREATE Operations
```javascript
// Create User (Registration)
POST /users/{uid}
{
  displayName: "John Learner",
  email: "john@example.com",
  username: "johnlearner",
  role: "learner",
  createdAt: "2026-09-01T10:00:00Z"
}

// Create Task
POST /tasks/{taskId}
{
  userId: "user123",
  title: "Complete JavaScript Fundamentals",
  description: "Review variables, operators, and functions",
  category: "JavaScript",
  status: "Pending",
  priority: "High",
  dueDate: "2026-09-15",
  createdAt: "2026-09-01T10:30:00Z"
}

// Create Support Booking
POST /bookings/{bookingId}
{
  userId: "user123",
  date: "2026-09-05",
  reason: "Need help with async/await",
  status: "Pending",
  createdAt: "2026-09-01T11:00:00Z"
}
```

#### READ Operations
```javascript
// Read User Profile
GET /users/{uid}
Returns: User object with all profile data

// Read All Tasks for User
GET /tasks?userId=user123
Returns: Array of task objects

// Read Single Task
GET /tasks/{taskId}
Returns: Task object with all details

// Read User's Support Bookings
GET /bookings?userId=user123
Returns: Array of booking objects

// Calculate Progress
GET /users/{uid}/progress
Returns: {
  totalTasks: 10,
  completedTasks: 6,
  outstanding: 4,
  percentage: 60
}
```

#### UPDATE Operations
```javascript
// Update Task Status
PATCH /tasks/{taskId}
{
  status: "Completed",
  updatedAt: "2026-09-02T14:30:00Z",
  completedAt: "2026-09-02T14:30:00Z"
}

// Update Task Details
PATCH /tasks/{taskId}
{
  title: "Updated Title",
  description: "Updated description",
  priority: "Medium",
  updatedAt: "2026-09-02T14:35:00Z"
}

// Update User Preferences
PATCH /users/{uid}
{
  theme: "dark",
  lastLogin: "2026-09-02T14:40:00Z"
}

// Update Booking Status
PATCH /bookings/{bookingId}
{
  status: "Confirmed",
  updatedAt: "2026-09-02T15:00:00Z"
}
```

#### DELETE Operations
```javascript
// Delete Task
DELETE /tasks/{taskId}
Removes task record and updates user progress

// Cancel Booking
DELETE /bookings/{bookingId}
Removes booking record

// Archive/Deactivate User Account
DELETE /users/{uid}
Or: PATCH /users/{uid} { status: "archived" }
```

### Security Rules (Firebase)
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "tasks": {
      "$taskId": {
        ".read": "root.child('tasks').child($taskId).child('userId').val() === auth.uid",
        ".write": "root.child('tasks').child($taskId).child('userId').val() === auth.uid"
      }
    },
    "bookings": {
      "$bookingId": {
        ".read": "root.child('bookings').child($bookingId).child('userId').val() === auth.uid",
        ".write": "root.child('bookings').child($bookingId).child('userId').val() === auth.uid"
      }
    }
  }
}
```

---

## 5. OBJECT-ORIENTED DESIGN

### Class Hierarchy

#### User Class
```javascript
class User {
  constructor(uid, displayName, email) {
    this.uid = uid;
    this.displayName = displayName;
    this.email = email;
    this.tasks = [];        // Array of Task objects
    this.bookings = [];     // Array of Booking objects
    this.preferences = {};  // User preferences (theme, etc.)
    this.createdAt = new Date();
  }

  // Instance methods
  addTask(task) {
    if (task.userId !== this.uid) {
      throw new Error('Task belongs to a different user');
    }
    this.tasks.push(task);
  }

  completeTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.markComplete();
    }
  }

  getProgress() {
    return calculateProgress(this.tasks);
  }

  setPreference(key, value) {
    this.preferences[key] = value;
  }
}
```

**Properties:** uid, displayName, email, tasks, bookings, preferences  
**Methods:** addTask(), completeTask(), getProgress(), setPreference()  
**Relationships:** Owns multiple Task and Booking objects

#### Task Class
```javascript
class Task {
  constructor(title, dueDate, userId) {
    this.id = Date.now();
    this.title = title;
    this.dueDate = dueDate;
    this.userId = userId;
    this.description = '';
    this.status = 'Pending';      // Pending, In Progress, Completed
    this.priority = 'Medium';     // Low, Medium, High
    this.category = '';
    this.completed = false;
    this.createdAt = new Date();
  }

  // Instance methods
  markComplete() {
    this.completed = true;
    this.status = 'Completed';
  }

  updateDetails(title, description, priority) {
    this.title = title;
    this.description = description;
    this.priority = priority;
  }

  isOverdue() {
    return new Date() > new Date(this.dueDate) && !this.completed;
  }
}
```

**Properties:** id, title, dueDate, userId, status, priority, completed  
**Methods:** markComplete(), updateDetails(), isOverdue()  
**Relationships:** Belongs to one User object

#### Booking Class
```javascript
class Booking {
  constructor(userId, date, reason) {
    this.id = Date.now();
    this.userId = userId;
    this.date = date;
    this.reason = reason;
    this.status = 'Pending';    // Pending, Confirmed, Completed, Cancelled
    this.notes = '';
    this.createdAt = new Date();
  }

  // Instance methods
  confirm() {
    this.status = 'Confirmed';
  }

  complete(notes = '') {
    this.status = 'Completed';
    this.notes = notes;
  }

  cancel() {
    this.status = 'Cancelled';
  }
}
```

**Properties:** id, userId, date, reason, status, notes  
**Methods:** confirm(), complete(), cancel()  
**Relationships:** Belongs to one User object

#### Utility Functions

```javascript
/**
 * Calculates progress statistics from tasks array
 * @param {Task[]} tasks - Array of Task objects
 * @returns {Object} Progress statistics
 */
function calculateProgress(tasks) {
  const completed = tasks.filter(task => task.completed).length;
  const total = tasks.length;
  const outstanding = total - completed;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { total, completed, outstanding, percentage };
}
```

### Class Relationships Diagram

```
User (1) ---- owns ---- Task (*)
  �
  +--- owns ---- Booking (*)
  
Each Task and Booking has:
  - userId (reference to parent User)
  - createdAt timestamp
  - status tracker
```

---

## 6. REPOSITORY STRUCTURE

```
TPC/
+-- .github/
�   +-- workflows/              # CI/CD configuration
�       +-- tests.yml           # Automated testing on push
�
+-- backend/
�   +-- app.js                  # Entry point
�   +-- models.js               # User, Task, Booking classes
�   +-- auth.js                 # Authentication logic
�   +-- database.js             # Firebase database operations
�   +-- firebase.js             # Firebase configuration
�   +-- ui.js                   # DOM manipulation utilities
�
+-- public/
�   +-- index.html              # Landing page
�   +-- register.html           # Account creation
�   +-- signin.html             # Login page
�   +-- dashboard.html          # Main dashboard
�   +-- tasks.html              # Task management page
�   +-- support.html            # Support booking page
�   +-- styles/
�   �   +-- style.css           # Global styles
�   �   +-- dashboard.css       # Dashboard-specific styles
�   �   +-- tasks.css           # Task page styles
�   �   +-- responsive.css      # Mobile responsiveness
�   +-- images/                 # Images and assets
�   +-- js/
�       +-- app.js              # Main application logic
�       +-- auth.js             # Auth-related UI logic
�       +-- tasks.js            # Task management UI
�       +-- utils.js            # Helper functions
�
+-- tests/
�   +-- models.test.js          # Unit tests for classes
�   +-- auth.test.js            # Authentication tests
�   +-- integration.test.js     # Integration tests
�
+-- database/
�   +-- schema.json             # Firebase database schema reference
�
+-- css/
�   +-- style.css               # Alternative CSS location
�
+-- js/
�   +-- app.js                  # Alternative JS location
�
+-- assets/
�   +-- firebase.json           # Firebase configuration
�
+-- .gitignore                  # Git ignore rules
+-- .eslintrc.json              # ESLint configuration
+-- eslint.config.js            # ESLint config (modern)
+-- package.json                # NPM dependencies
+-- package-lock.json           # Dependency lock file
+-- README.md                   # Project documentation (this file)
```

---

## 7. TEAM ROLES & CONTRIBUTIONS

### Squad 9 Members

| Name | Primary Role | Responsibilities | Current Status |
|------|--------------|-----------------|-----------------|
| Karrel | Team Lead | Architecture, planning, reviews | Contributing |
| Kgodiso | Lead Developer | Backend, models, testing | Contributing |
| Sibuiso | Frontend Developer | UI, styling, user experience | Contributing |

### Contribution Strategy

- **Code Reviews:** All PRs reviewed by at least one other team member
- **Pair Programming:** Complex features implemented together
- **Documentation:** Each feature must include inline comments and JSDoc
- **Testing:** Each developer responsible for testing their own code + peer testing

---

## 8. DEVELOPMENT ENVIRONMENT SETUP

### Prerequisites
- Node.js v18+ (or your current version)
- npm or yarn
- Git and GitHub account
- Firebase project account
- Code editor (VS Code recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/Kgodisok/TPC.git
cd TPC

# Install dependencies
npm install

# Create .env file (see .env.example)
cp .env.example .env

# Add your Firebase configuration to .env
# FIREBASE_API_KEY=your_key_here
# FIREBASE_PROJECT_ID=your_project_id
```

### Running the Application

```bash
# Start development server
npm start

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

### Firebase Configuration

1. Create Firebase project: https://firebase.google.com/
2. Enable Authentication (Email/Password)
3. Create Realtime Database
4. Copy config to `backend/firebase.js`
5. Set security rules according to schema above

---

## 9. KEY DEVELOPMENT DECISIONS

### Technology Choices

| Decision | Rationale |
|----------|-----------|
| **Firebase Realtime DB** | Real-time sync, easy authentication, free tier |
| **Vanilla JavaScript** | Learn fundamentals without heavy frameworks |
| **localStorage (Phase 1)** | Simple persistence before Firebase integration |
| **ESLint** | Code quality and consistency |
| **Node test runner** | Built-in testing without external dependencies |

### Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **Modular Classes** | Code reusability, testability, maintainability |
| **Separation of Concerns** | Models (data) separate from UI logic |
| **DRY (Don't Repeat Yourself)** | Utility functions for common operations |
| **Feature Branches** | Parallel development, easy code review |

---

## 10. TESTING STRATEGY

### Unit Tests (Implemented)
-  User class: addTask, getProgress
-  Task class: markComplete, isOverdue
-  Progress calculation: various scenarios

### Integration Tests (Planned)
- Authentication workflow (register ? login ? dashboard)
- Task creation ? update ? completion
- Support booking workflow

### Manual Testing Checklist
- [ ] Registration: valid and invalid inputs
- [ ] Login: correct/incorrect credentials
- [ ] Dashboard: displays correct user data
- [ ] Task CRUD: all operations work
- [ ] Search/Filter: returns correct results
- [ ] Responsive design: mobile, tablet, desktop

---

## 11. KNOWN ISSUES & IMPROVEMENTS

### Current Limitations (Month 1)
- [WARNING] Using localStorage (not secure for production)
- [WARNING] No password encryption
- [WARNING] No Firebase integration yet (Phase 2)
- [WARNING] Limited error handling
- [WARNING] No input validation

### Future Improvements (Months 2+)
- [SECURE] Implement Firebase Authentication
- [SECURE] Hash passwords with bcrypt
- [FEATURE] Advanced analytics dashboard
- [FEATURE] Mobile app with React Native
- [FEATURE] Push notifications
- [FEATURE] Real-time collaboration features
- [FEATURE] Accessibility improvements (WCAG 2.1)
- [FEATURE] E2E testing with Cypress

---

## 12. RESOURCES & REFERENCES

### Documentation Links
- [Firebase Realtime Database](https://firebase.google.com/docs/database)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [Web.dev Best Practices](https://web.dev/)
- [Git Workflow Guide](https://www.atlassian.com/git/tutorials)

### Learning Resources
- [FreeCodeCamp JavaScript Course](https://www.freecodecamp.org/learn/javascript/)
- [Eloquent JavaScript](https://eloquentjavascript.net/)
- [You Don't Know JS Yet](https://github.com/getify/You-Dont-Know-JS)

---

## 13. MONTH 1 REVIEW EVIDENCE CHECKLIST

### Planning & Architecture 
- [x] Problem analysis documented
- [x] User stories with acceptance criteria (12 stories)
- [x] Requirements scope defined
- [x] Programming lifecycle plan with milestones
- [x] Firebase data structure documented
- [x] OOP classes designed and implemented
- [x] Architecture documented

### Tools & Collaboration 
- [x] IDE configured (VS Code)
- [x] Linter configured (ESLint)
- [x] GitHub repository created
- [x] .gitignore properly set up
- [x] Branch workflow established
- [x] README documentation complete

### Core JavaScript 
- [x] Code style and organization improved
- [x] Meaningful variable and function naming
- [x] Proper scoping with modules/closures
- [x] Arrow functions used appropriately
- [x] Array methods (filter, map) demonstrated
- [x] Reusable functions with parameters and returns

### Testing & Debugging 
- [x] Unit tests implemented (4 passing tests)
- [x] Test runner configured
- [x] Models properly exported/imported
- [x] Basic debugging with browser DevTools

---

## 14. HOW TO USE THIS DOCUMENT

**For Learners:**
1. Review user stories to understand features
2. Check lifecycle plan for sprint planning
3. Reference OOP design when coding models
4. Follow repository structure for file organization

**For Assessors:**
1. See planning rigor in sections 1-3
2. Review technical design in sections 4-5
3. Check implementation against user stories
4. Verify testing strategy in section 10

**For Facilitators:**
1. Use milestones for progress tracking
2. Reference testing strategy for checkpoint reviews
3. Use known issues for learning guidance

---

**Last Updated:** September 1, 2026  
**Status:** Month 1 Planning Complete - Ready for Implementation  
**Next Review:** September 25, 2026 (Month 1 Development Review)
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

Pseudocode is stored in the project documentation folder at docs/pseudocode/application-pseudocode.md.

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
        ?
Create a feature branch
        ?
Write the code
        ?
Test the changes
        ?
Commit the work
        ?
Push the branch to GitHub
        ?
Open a Pull Request
        ?
Peer review
        ?
Make any required changes
        ?
Merge into main
        ?
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

This README is based on the supplied JavaScript Programmer � Two-Month Integrated Project brief for the SkillsTrack Learner Support Portal. The brief covers the application requirements, Firebase data structure, REST communication, JavaScript development, GitHub collaboration, testing and the two-month assessment deliverables.

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
