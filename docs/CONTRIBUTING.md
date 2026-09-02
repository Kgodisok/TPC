# Contributing to SkillsTrack Learner Support Portal

Thank you for contributing to the Squad 9 SkillsTrack project! This document provides guidelines for how we work together as a team.

## Code of Conduct

- Be respectful and supportive of team members
- Communicate clearly in pull request descriptions and code reviews
- Ask for help when needed - we're learning together
- Share knowledge and help others understand the codebase

## Development Workflow

### 1. Branch Strategy

We follow a feature branch workflow:

```
main (production-ready code)
  ↑
  ├── feature/authentication
  ├── feature/task-manager
  ├── feature/support-booking
  └── bugfix/login-validation
```

**Branch Naming Convention:**
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation
- `refactor/improvement-description` - Code refactoring
- `test/test-description` - Test additions

### 2. Creating a Feature Branch

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: Clear description of what changed"
```

### 3. Commit Message Format

Follow this format for clear commit history:

```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code restructuring
- `test:` Test additions/modifications
- `docs:` Documentation
- `style:` Code formatting
- `chore:` Build, dependencies, configs

**Example:**
```
feat: Add task completion functionality

- Implement completeTask() method in Task class
- Add UI button to mark tasks complete
- Update progress calculation

Closes #5
```

### 4. Pull Request Process

1. **Push your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request on GitHub:**
   - Go to https://github.com/Kgodisok/TPC
   - Click "New Pull Request"
   - Select your branch as source, main as target
   - Fill in the PR template:
     ```markdown
     ## Description
     Brief description of changes
     
     ## Type of Change
     - [ ] New feature
     - [ ] Bug fix
     - [ ] Documentation
     - [ ] Refactoring
     
     ## Related Issues
     Closes #(issue number)
     
     ## Testing Done
     How was this tested?
     
     ## Screenshots (if applicable)
     ```

3. **Code Review:**
   - At least one other team member must review
   - Address feedback and make requested changes
   - Resolve merge conflicts if any

4. **Merge:**
   - After approval, squash and merge to main
   - Delete the feature branch

### 5. Code Quality Standards

#### JavaScript Style Guide

- Use `const` by default, `let` for variables that change
- Avoid `var` entirely
- Use arrow functions for callbacks
- Use meaningful variable names (not `x`, `temp`, `data`)
- Maximum 100 characters per line
- Use 2-space indentation (configured in .prettierrc)

**Good Example:**
```javascript
const calculateTaskProgress = (tasks) => {
  const completed = tasks.filter((task) => task.completed).length;
  const total = tasks.length;
  return Math.round((completed / total) * 100);
};
```

**Bad Example:**
```javascript
var calculateProgress = function(t) {
  var c = 0;
  for (var i = 0; i < t.length; i++) {
    if (t[i].completed) c++;
  }
  return Math.round((c / t.length) * 100);
};
```

#### Comments & Documentation

- Use JSDoc for functions:
```javascript
/**
 * Calculates progress percentage for a user's tasks
 * @param {Task[]} tasks - Array of Task objects
 * @returns {number} Progress percentage (0-100)
 */
const calculateProgress = (tasks) => {
  // Implementation
};
```

- Add inline comments for complex logic
- Keep comments up-to-date with code changes

#### Linting & Formatting

Before pushing code:

```bash
# Check for lint errors
npm run lint

# Auto-fix formatting issues
npm run format

# Run all tests
npm test
```

All tests must pass before creating a PR.

### 6. Testing Requirements

- Write unit tests for new functions
- Test edge cases (empty arrays, null values, etc.)
- Minimum 80% code coverage for new code
- Run tests locally before pushing: `npm test`

**Example Test:**
```javascript
test('completeTask() marks task as completed', () => {
  const task = new Task('Learn JS', '2026-09-15', 'user-1');
  task.markComplete();
  
  assert.equal(task.completed, true);
  assert.equal(task.status, 'Completed');
});
```

### 7. Review Checklist for Code Reviews

When reviewing a PR, check:

- [ ] Code follows style guidelines
- [ ] Variable/function names are clear and meaningful
- [ ] No `console.log()` statements left in production code
- [ ] Tests are included and passing
- [ ] No hardcoded values or secrets
- [ ] Comments explain the "why", not the "what"
- [ ] Functions have a single responsibility
- [ ] No repeated code (DRY principle)
- [ ] Error handling is implemented
- [ ] Documentation is updated if needed

### 8. Conflict Resolution

If merge conflicts occur:

1. **Fetch latest main:**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Resolve conflicts:**
   - Open conflicted files
   - Look for `<<<<<<`, `======`, `>>>>>` markers
   - Keep the code that makes sense (usually both parts needed)
   - Delete conflict markers

3. **Complete rebase:**
   ```bash
   git add .
   git rebase --continue
   git push origin feature/your-feature-name --force
   ```

### 9. Local Development Setup

```bash
# Clone repository
git clone https://github.com/Kgodisok/TPC.git
cd TPC

# Install dependencies
npm install

# Create feature branch
git checkout -b feature/your-feature

# Make changes...

# Run quality checks
npm run lint
npm run format
npm test

# Commit and push
git add .
git commit -m "feat: your changes"
git push origin feature/your-feature
```

### 10. CI/CD Pipeline

All pushed code automatically:
- ✅ Installs dependencies
- ✅ Runs tests with `npm test`
- ✅ Runs linter with `npm run lint`
- ✅ Reports results on GitHub

**If CI fails:**
1. Check the GitHub Actions output
2. Fix issues locally
3. Push again
4. CI runs automatically on new commits

### 11. Release Process

When ready for submission:

1. Ensure all tests pass: `npm test`
2. Update version in package.json
3. Create release branch: `git checkout -b release/v1.0.0`
4. Create final PR with "RELEASE:" prefix
5. After merge, create GitHub Release with notes

## Common Issues & Solutions

### Issue: My changes don't appear in the PR
**Solution:**
```bash
git pull origin main
git push origin feature/your-feature-name
```

### Issue: Merge conflict with main
**Solution:**
```bash
git fetch origin
git rebase origin/main
# Resolve conflicts in your editor
git add .
git rebase --continue
```

### Issue: Need to update feature branch with latest main
**Solution:**
```bash
git fetch origin
git rebase origin/main
git push origin feature/your-feature-name --force-with-lease
```

### Issue: Accidentally committed to main
**Solution:**
```bash
git reset HEAD~1                          # Undo last commit
git checkout -b feature/recovered-work    # Create new branch
git commit -m "feat: your work"
git push origin feature/recovered-work
```

## Useful Git Commands

```bash
# See current status
git status

# See commit history
git log --oneline -10

# See branches
git branch -a

# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name

# Check differences
git diff main

# Stash uncommitted changes
git stash

# Restore stashed changes
git stash pop
```

## Getting Help

- **Ask questions in GitHub Issues** - tag relevant team members
- **Code review comments** - respond to feedback promptly
- **Slack/Teams** - for quick questions during development
- **Weekly standup** - discuss blockers and plans

## Team Communication

- **Daily standups:** 10:00 AM - What did I do? What's blocking? What's next?
- **PR reviews:** Aim for 24-hour turnaround
- **Issues:** Use GitHub Issues for feature requests and bugs
- **Milestones:** Track progress toward release dates

## Performance & Monitoring

- Monitor CI/CD pipeline health
- Track test coverage trends
- Review bundle size impact of changes
- Profile performance impacts of new features

## Acknowledgments

Thanks for being part of Squad 9! Your contributions make this project better.

---

**Last Updated:** September 1, 2026  
**Questions?** Create an issue or ask in team chat!
