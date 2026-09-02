# System Architecture - SkillsTrack Learner Support Portal

This document outlines the system architecture, design patterns, and technical decisions for the SkillsTrack project.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [System Components](#system-components)
3. [Data Flow](#data-flow)
4. [Design Patterns](#design-patterns)
5. [Technology Stack](#technology-stack)
6. [Security Architecture](#security-architecture)
7. [Scalability & Performance](#scalability--performance)
8. [Deployment](#deployment)

---

## Architecture Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ HTML     │  │   CSS    │  │   JS     │  │ Assets   │    │
│  │ (Pages)  │  │ (Styles) │  │ (Logic)  │  │(Images)  │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└──────────────────────────────────────────────────────────────┘
         │
         │ HTTP/REST Requests
         ↓
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Modules (Auth, Tasks, UI, Utils)                  │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐   │   │
│  │  │ Auth       │  │ TaskMgr    │  │ UIUtils    │   │   │
│  │  │ Module     │  │ Module     │  │ Module     │   │   │
│  │  └────────────┘  └────────────┘  └────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Business Logic (Models Layer)                      │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐   │   │
│  │  │ User       │  │ Task       │  │ Booking    │   │   │
│  │  │ Class      │  │ Class      │  │ Class      │   │   │
│  │  └────────────┘  └────────────┘  └────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
         │
         │ Firebase SDK
         ↓
┌─────────────────────────────────────────────────────────────┐
│                    Firebase Backend                          │
│  ┌──────────────────┐  ┌──────────────────────────────┐    │
│  │ Authentication   │  │ Realtime Database            │    │
│  │ - Register       │  │ - Users                      │    │
│  │ - Login          │  │ - Tasks                      │    │
│  │ - Session Mgmt   │  │ - Bookings                   │    │
│  │ - Logout         │  │ - Support Sessions          │    │
│  └──────────────────┘  └──────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Type

**Client-Side MVC (Phase 1) → Client-Server MVC (Phase 2+)**

- **Phase 1 (Current):** Client-side application with localStorage persistence
- **Phase 2:** Firebase backend integration with server-side validation
- **Phase 3+:** Microservices with dedicated API servers

---

## System Components

### 1. Client Layer (Frontend)

#### HTML Structure
- **index.html** - Landing page
- **register.html** - Account creation form
- **signin.html** - Login form
- **dashboard.html** - Main dashboard view
- **tasks.html** - Task management interface
- **support.html** - Support booking interface

#### CSS Styling
- **style.css** - Global styles and layout
- **responsive.css** - Mobile-first responsive design
- **dashboard.css** - Dashboard-specific styles
- **animations.css** - Transitions and animations

#### JavaScript Modules

**app.js - Main Application Module**
- Initializes all features
- Coordinates between modules
- Handles page routing

**auth.js - Authentication Module**
- User registration/login logic
- Session management
- Authentication state

**tasks.js - Task Manager Module**
- CRUD operations for tasks
- Search and filter logic
- Progress calculation

**ui.js - UI Utilities Module**
- DOM manipulation helpers
- Event handling utilities
- Theme management

### 2. Application Layer (Business Logic)

#### Model Classes

```javascript
// User Model
class User {
  - uid (unique identifier)
  - displayName
  - email
  - tasks (Task[])
  - bookings (Booking[])
  - preferences (Object)
  - Methods: addTask(), getProgress(), setPreference()
}

// Task Model
class Task {
  - id (unique identifier)
  - userId (reference to User)
  - title
  - description
  - status (Pending|In Progress|Completed)
  - priority (Low|Medium|High)
  - dueDate
  - Methods: markComplete(), updateDetails(), isOverdue()
}

// Booking Model
class Booking {
  - id (unique identifier)
  - userId (reference to User)
  - date
  - reason
  - status (Pending|Confirmed|Completed|Cancelled)
  - Methods: confirm(), complete(), cancel()
}
```

#### Module Pattern (IIFE - Immediately Invoked Function Expression)

Provides encapsulation and avoids global namespace pollution:

```javascript
const AuthModule = (() => {
  // Private variables
  const USER_KEY = 'skillsTrackUser';
  
  // Private methods
  const validateCredentials = () => { /* ... */ };
  
  // Public API
  return {
    authenticate: (username, password) => { /* ... */ },
    logout: () => { /* ... */ }
  };
})();
```

### 3. Data Layer (Persistence)

#### Phase 1: localStorage
- Key-value storage in browser
- Limited to ~5-10MB
- Accessible only to same-origin pages
- Used for: user data, tasks, preferences

#### Phase 2: Firebase Realtime Database
- Real-time sync across devices
- Automatic offline support
- Scalable to millions of users
- Server-side validation and security

### 4. Firebase Backend

#### Authentication Service
- Email/Password authentication
- Session tokens
- User identity verification
- Password reset flow

#### Realtime Database
- Document-based data storage
- Real-time synchronization
- Offline persistence
- Query capabilities

---

## Data Flow

### User Registration Flow

```
1. User visits register.html
   ↓
2. User fills form (name, username, password, confirm)
   ↓
3. Form submitted (submit event)
   ↓
4. JavaScript validation
   - Check passwords match
   - Check required fields
   ↓
5. Create User object
   ↓
6. Store to localStorage (Phase 1) / Firebase (Phase 2)
   ↓
7. Display success message
   ↓
8. Redirect to signin.html after 1 second
```

### Task Creation Flow

```
1. User on dashboard clicks "New Task"
   ↓
2. Task form opens/displays
   ↓
3. User enters: title, description, status
   ↓
4. Form submitted
   ↓
5. Validation
   - Check required fields
   - Check input length
   ↓
6. Create Task object with:
   - Unique ID (timestamp)
   - User ID (current user)
   - Timestamp
   ↓
7. Add to TaskManager.tasks array
   ↓
8. Save to storage (localStorage/Firebase)
   ↓
9. Re-render task list
   ↓
10. Recalculate progress
    ↓
11. Update dashboard display
```

### Task Completion Flow

```
1. User clicks "Complete" on a task
   ↓
2. completeTask(taskId) called
   ↓
3. Find task in array by ID
   ↓
4. Update task.status = "Completed"
   ↓
5. Update task.completedAt = now
   ↓
6. Save to storage
   ↓
7. Recalculate user progress
   ↓
8. Update dashboard display
   ↓
9. Trigger optional celebration animation
```

---

## Design Patterns

### 1. Module Pattern (Encapsulation)

Provides private and public members:

```javascript
const TaskManager = (() => {
  // Private
  let tasks = [];
  
  const saveTasks = () => { /* ... */ };
  
  // Public API
  return {
    addTask: (title) => { /* ... */ },
    getTasks: () => [...tasks] // Return copy, not reference
  };
})();
```

**Benefits:**
- Namespace management
- Private state protection
- Clear public interface
- Prevents global variable pollution

### 2. Observer Pattern (Event Handling)

Components react to state changes:

```javascript
// Event listener
searchInput.addEventListener('input', () => {
  TaskDisplay.displayTasks(); // Update view when search changes
});

// Publishing changes
TaskManager.addTask(title);
TaskDisplay.displayTasks(); // Subscribers notified
```

### 3. Factory Pattern (Object Creation)

Centralized object creation:

```javascript
// Instead of: new Task(...)
TaskManager.addTask('Title') // Factory creates Task internally

// Benefits: Encapsulates creation logic, easier to change
```

### 4. MVC (Model-View-Controller)

**Model:** User, Task, Booking classes (data structure)  
**View:** HTML templates + DOM updates  
**Controller:** Event listeners and business logic

```
User Input → Event Handler (Controller) → Update Model → Update View
```

### 5. Singleton Pattern

Single instance of shared services:

```javascript
const AuthModule = (() => { /* ... */ })(); // Only one instance
const TaskManager = (() => { /* ... */ })(); // Only one instance
```

---

## Technology Stack

### Frontend

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Markup** | HTML5 | Latest | Document structure |
| **Styling** | CSS3 | Latest | Visual design, responsive |
| **Language** | JavaScript | ES6+ | Application logic |
| **Runtime** | Node.js | 18+ | Development environment |
| **Package Mgr** | npm | Latest | Dependency management |

### Development Tools

| Tool | Purpose | Config |
|------|---------|--------|
| **ESLint** | Code quality | .eslintrc.json |
| **Prettier** | Code formatting | .prettierrc |
| **Jest/Node Test** | Testing | package.json scripts |
| **GitHub** | Version control | .github/workflows/ |
| **Firebase** | Backend (Phase 2) | Firebase console |

### Libraries & Frameworks

| Library | Purpose | Version | Usage |
|---------|---------|---------|-------|
| **Firebase SDK** | Backend services | 12.x | Authentication, Database (Phase 2) |
| (Others as needed) | | | |

---

## Security Architecture

### Phase 1: Client-Side Security (Current)

#### Potential Vulnerabilities
⚠️ **NOT for production use**
- Passwords stored in localStorage (visible to anyone with browser access)
- No HTTPS enforcement
- XSS vulnerability if user input not escaped
- CSRF if forms don't validate origin

#### Mitigation Measures Implemented
✅ Input validation on client
✅ HTML escaping in DOM operations
✅ Using const/let instead of global variables
✅ Session token in localStorage

### Phase 2: Production Security (Planned)

#### Implementation
```javascript
// Firebase Authentication Rules
rules: {
  users: {
    $uid: {
      ".read": "$uid === auth.uid",    // Users can only read own data
      ".write": "$uid === auth.uid"    // Users can only write own data
    },
    tasks: {
      $taskId: {
        ".read": "task belongs to authenticated user",
        ".write": "task belongs to authenticated user"
      }
    }
  }
}
```

#### Security Best Practices
1. **Authentication** - Firebase Auth with secure tokens
2. **Authorization** - Database rules enforce ownership
3. **Data Validation** - Server-side validation
4. **HTTPS** - All communication encrypted
5. **Password Hashing** - Firebase Auth handles securely
6. **Session Management** - Automatic token refresh
7. **Secret Management** - Environment variables for keys
8. **CORS** - Restrict cross-origin requests
9. **Rate Limiting** - Prevent abuse
10. **Audit Logging** - Track all changes

---

## Scalability & Performance

### Current Phase (Single Client)

**Limitations:**
- Data stored locally (~5-10MB limit)
- No multi-device sync
- No real-time collaboration
- Single user at a time

### Phase 2: Firebase Backend

**Capabilities:**
- Unlimited data (cloud storage)
- Real-time sync across devices
- Handle multiple concurrent users
- Automatic scaling

### Performance Optimization

#### Current (Phase 1)
- Lazy load modules only when needed
- Cache DOM element references
- Debounce search input
- Batch DOM updates

#### Phase 2+
- Pagination for large task lists
- Virtual scrolling for 1000+ items
- Service Worker for offline support
- CloudFront CDN for static assets
- Database indexing for queries

### Monitoring & Metrics

```javascript
// Performance tracking (Phase 2+)
- Page load time (target: < 2s)
- Time to interactive (target: < 3s)
- Search response time (target: < 100ms)
- Database query latency (target: < 50ms)
```

---

## Deployment

### Development Environment

```bash
npm install          # Install dependencies
npm start           # Run local server
npm test            # Run tests
npm run lint        # Check code quality
npm run format      # Format code
```

### CI/CD Pipeline

```
Code Push → GitHub Actions
           ↓
           Run Tests → ✓ Pass / ✗ Fail
           ↓
           Run Linter → ✓ Pass / ✗ Fail
           ↓
           (Optional) Deploy to staging
```

### Deployment Targets

**Phase 1:** GitHub Pages (static hosting)
- No backend needed
- Free unlimited hosting
- Fast CDN delivery

**Phase 2+:** Firebase Hosting + Cloud Functions
- Dynamic backend support
- Serverless functions
- Real-time database integration
- Automatic scaling

---

## Future Enhancements

### Phase 2 (Month 2-3)
- [ ] Firebase Authentication integration
- [ ] Real-time database persistence
- [ ] Multi-device synchronization
- [ ] Push notifications
- [ ] Advanced search with indexing

### Phase 3 (Month 4-6)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Machine learning recommendations
- [ ] Real-time collaboration
- [ ] Video conferencing integration

### Phase 4+ (Beyond Month 6)
- [ ] Microservices architecture
- [ ] Kubernetes deployment
- [ ] Advanced caching (Redis)
- [ ] Machine learning model serving
- [ ] Global CDN deployment

---

## Architecture Decision Log

### Decision 1: Module Pattern for Encapsulation
**Problem:** Global namespace pollution, private state needed  
**Solution:** Use IIFE + Module pattern  
**Tradeoff:** Slightly more complex, but better encapsulation  
**Status:** ✅ Implemented

### Decision 2: localStorage for Phase 1
**Problem:** Need simple persistence without backend  
**Solution:** Use browser localStorage API  
**Tradeoff:** 5-10MB limit, same-origin only, not production-safe  
**Status:** ✅ Implemented (Phase 1), Plan to replace with Firebase Phase 2

### Decision 3: OOP Classes for Models
**Problem:** Need structured data and behavior together  
**Solution:** ES6 Classes (User, Task, Booking)  
**Tradeoff:** More memory, but better code organization  
**Status:** ✅ Implemented

### Decision 4: Event-Driven Updates
**Problem:** UI needs to stay synchronized with data  
**Solution:** Use event listeners for reactive updates  
**Tradeoff:** More listeners, but loose coupling  
**Status:** ✅ Implemented

---

## Glossary

- **CRUD:** Create, Read, Update, Delete operations
- **MVC:** Model-View-Controller architecture pattern
- **IIFE:** Immediately Invoked Function Expression
- **localStorage:** Browser-based key-value storage
- **Firebase:** Google's backend-as-a-service platform
- **REST:** Representational State Transfer (API style)
- **CI/CD:** Continuous Integration/Continuous Deployment
- **Singleton:** Design pattern for single instance

---

**Document Version:** 1.0  
**Last Updated:** September 1, 2026  
**Status:** Month 1 Planning Complete  
**Next Review:** September 25, 2026
