# Test Case Matrix

## User Registration
| Test ID | Test Input | Expected Result |
| --- | --- | --- |
| TC-01 | Empty email, "Password123!" | Reject: email and password required |
| TC-02 | "learner@example.com", empty password | Reject: password required |
| TC-03 | "learner@example.com", "Pass123" | Reject: password too short |
| TC-04 | "learner@example.com", "Password123!" and "Taylor Morgan" | Accept: valid registration |
| TC-05 | "learner@invalid", "Password123!" | Reject: invalid email format |
| TC-06 | "Taylor42", "Password123!" | Reject: invalid name format |
| TC-07 | "Taylor Morgan", "Password123" | Reject: password must include a symbol |

## Login Validation
| Test ID | Test Input | Expected Result |
| --- | --- | --- |
| TC-08 | Empty email, empty password | Reject: email and password required |
| TC-09 | "learner@example.com", "wrongpass" | Reject: invalid credentials |
| TC-10 | "learner@example.com", "Password123!" | Accept: redirect to dashboard |

## Task Management
| Test ID | Test Input | Expected Result |
| --- | --- | --- |
| TC-11 | Empty task title | Reject: task title required |
| TC-12 | "Finish project", valid due date | Accept: task saved |
| TC-13 | Completed task | Update status to completed |
