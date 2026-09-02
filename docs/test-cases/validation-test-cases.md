# Test Case Matrix

## User Registration
| Test ID | Test Input | Expected Result |
| --- | --- | --- |
| TC-01 | Empty email, "password123" | Reject: email and password required |
| TC-02 | "learner@example.com", empty password | Reject: password required |
| TC-03 | "learner@example.com", "pass123" | Reject: password too short |
| TC-04 | "learner@example.com", "Password123" | Accept: valid registration |

## Login Validation
| Test ID | Test Input | Expected Result |
| --- | --- | --- |
| TC-05 | Empty email, empty password | Reject: email and password required |
| TC-06 | "learner@example.com", "wrongpass" | Reject: invalid credentials |
| TC-07 | "learner@example.com", "Password123" | Accept: redirect to dashboard |

## Task Management
| Test ID | Test Input | Expected Result |
| --- | --- | --- |
| TC-08 | Empty task title | Reject: task title required |
| TC-09 | "Finish project", valid due date | Accept: task saved |
| TC-10 | Completed task | Update status to completed |
