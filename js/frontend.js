const STORAGE_KEY = 'skillsTrackPortal';
const FIREBASE_CONFIG = {
    apiKey: 'demo-api-key',
    authDomain: 'skills-track-demo.firebaseapp.com',
    projectId: 'skills-track-demo',
    storageBucket: 'skills-track-demo.appspot.com',
    messagingSenderId: '1234567890',
    appId: '1:1234567890:web:demo-app-id'
};

function getFirebaseConfig() {
    if (window.__FIREBASE_CONFIG__) {
        return { ...FIREBASE_CONFIG, ...window.__FIREBASE_CONFIG__ };
    }

    return FIREBASE_CONFIG;
}

function isFirebaseReady() {
    const config = getFirebaseConfig();
    const hasRealValues = Boolean(config.apiKey && config.apiKey !== 'demo-api-key' && config.projectId && config.projectId !== 'skills-track-demo');
    return Boolean(window.firebase && hasRealValues);
}

function getAuthClient() {
    if (!isFirebaseReady()) {
        return null;
    }

    if (!window.firebase.apps.length) {
        window.firebase.initializeApp(getFirebaseConfig());
    }

    return window.firebase.auth();
}

function getState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
            const initial = {
                users: [{ id: 'demo-user', name: 'Learner Demo', email: 'learner@skillstrack.local', password: 'demo123' }],
                session: null,
                tasks: [
                    { id: 'task-101', title: 'Submit project brief', dueDate: '2026-10-06', priority: 'High', status: 'Pending', description: 'Finish the final brief for review.', completed: false },
                    { id: 'task-102', title: 'Complete reflection', dueDate: '2026-10-08', priority: 'Medium', status: 'Completed', description: 'Write a short reflection on the study plan.', completed: true }
                ],
                bookings: []
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
            return initial;
        }
        return JSON.parse(saved);
    } catch (error) {
        return { users: [], session: null, tasks: [], bookings: [] };
    }
}

function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function calculateProgress(tasks) {
    const completed = tasks.filter((task) => task.completed || task.status === 'Completed').length;
    const total = tasks.length;
    const outstanding = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, outstanding, percentage };
}

function renderLandingStats() {
    const elements = document.querySelectorAll('[data-live-stat]');
    if (!elements.length) return;

    const liveValues = {
        tasks: '48',
        sessions: '12',
        progress: '88%'
    };

    elements.forEach((element) => {
        const key = element.dataset.liveStat;
        element.textContent = liveValues[key] || element.textContent;
    });

    let tick = 0;
    setInterval(() => {
        tick += 1;
        const values = ['48', '52', '61', '73', '84', '88'];
        const label = document.querySelector('[data-live-stat="tasks"]');
        const progress = document.querySelector('[data-live-stat="progress"]');
        if (label) label.textContent = values[tick % values.length];
        if (progress) progress.textContent = `${((tick * 7) % 90) + 10}%`;
    }, 1800);
}

function setupAuthTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = {
        login: document.getElementById('loginForm'),
        register: document.getElementById('registerForm')
    };

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const type = tab.dataset.authTab;
            tabs.forEach((item) => item.classList.toggle('active', item === tab));
            Object.entries(forms).forEach(([key, form]) => {
                if (!form) return;
                form.classList.toggle('hidden', key !== type);
                form.classList.toggle('active', key === type);
            });
        });
    });
}

function setAuthMessage(message, type = 'success') {
    const node = document.getElementById('authMessage');
    if (!node) return;
    node.textContent = message;
    node.className = 'auth-message';
    node.classList.add(type);
}

function redirectToDashboard() {
    window.location.href = 'dashboard.html';
}

function handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const auth = getAuthClient();

    if (auth) {
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const currentUser = userCredential.user;
                const state = getState();
                state.session = {
                    id: currentUser.uid,
                    name: currentUser.displayName || currentUser.email.split('@')[0],
                    email: currentUser.email
                };
                saveState(state);
                setAuthMessage('Logged in successfully. Redirecting...', 'success');
                setTimeout(() => redirectToDashboard(), 500);
            })
            .catch((error) => {
                setAuthMessage(error.message || 'Unable to sign in right now.', 'error');
            });
        return;
    }

    const state = getState();
    const match = state.users.find((user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password);

    if (!match) {
        setAuthMessage('Incorrect email or password. Try the demo account: learner@skillstrack.local / demo123', 'error');
        return;
    }

    state.session = { id: match.id, name: match.name, email: match.email };
    saveState(state);
    setAuthMessage('Logged in successfully. Redirecting...', 'success');
    setTimeout(() => redirectToDashboard(), 500);
}

function handleRegisterSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();

    if (!name || !email || !password) {
        setAuthMessage('Please complete every field before creating an account.', 'error');
        return;
    }

    if (typeof name !== 'string' || /\d/.test(name)) {
        setAuthMessage('Your name must be text and must not contain numbers.', 'error');
        return;
    }

    const auth = getAuthClient();
    if (auth) {
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const currentUser = userCredential.user;
                if (currentUser && typeof currentUser.updateProfile === 'function') {
                    return currentUser.updateProfile({ displayName: name }).then(() => currentUser);
                }

                return currentUser;
            })
            .then((currentUser) => {
                const state = getState();
                state.session = {
                    id: currentUser.uid,
                    name: currentUser.displayName || name,
                    email: currentUser.email
                };
                saveState(state);
                setAuthMessage('Account created successfully. Redirecting...', 'success');
                setTimeout(() => redirectToDashboard(), 500);
            })
            .catch((error) => {
                setAuthMessage(error.message || 'Unable to create account.', 'error');
            });
        return;
    }

    const state = getState();
    const existing = state.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
    if (existing) {
        setAuthMessage('That email is already registered. Use sign in instead.', 'error');
        return;
    }

    const user = { id: `user-${Date.now()}`, name, email, password };
    state.users.push(user);
    state.session = { id: user.id, name: user.name, email: user.email };
    saveState(state);
    setAuthMessage('Account created successfully. Redirecting...', 'success');
    setTimeout(() => redirectToDashboard(), 500);
}

function getCurrentUser() {
    const auth = getAuthClient();
    if (auth && auth.currentUser) {
        return {
            id: auth.currentUser.uid,
            name: auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'Learner',
            email: auth.currentUser.email
        };
    }

    const state = getState();
    return state.session ? state.users.find((user) => user.id === state.session.id) : null;
}

function ensureSession() {
    const auth = getAuthClient();
    if (auth && auth.currentUser) {
        const state = getState();
        state.session = {
            id: auth.currentUser.uid,
            name: auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'Learner',
            email: auth.currentUser.email
        };
        saveState(state);
        return;
    }

    const state = getState();
    if (!state.session) {
        const demoUser = state.users[0];
        if (demoUser) {
            state.session = { id: demoUser.id, name: demoUser.name, email: demoUser.email };
            saveState(state);
        }
    }
}

function renderDashboard() {
    const user = getCurrentUser();
    const state = getState();
    const tasks = state.tasks;
    const progress = calculateProgress(tasks);

    const welcomeName = document.getElementById('welcomeName');
    if (welcomeName) welcomeName.textContent = user ? user.name : 'Learner';

    const total = document.getElementById('totalTasks');
    const completed = document.getElementById('completedTasks');
    const outstanding = document.getElementById('outstandingTasks');
    const percent = document.getElementById('progressPercent');
    const sidebarProgressBar = document.getElementById('sidebarProgressBar');

    if (total) total.textContent = String(progress.total);
    if (completed) completed.textContent = String(progress.completed);
    if (outstanding) outstanding.textContent = String(progress.outstanding);
    if (percent) percent.textContent = `${progress.percentage}%`;
    if (sidebarProgressBar) sidebarProgressBar.style.width = `${progress.percentage}%`;

    const summaryCompleted = document.getElementById('summaryCompleted');
    const summaryOutstanding = document.getElementById('summaryOutstanding');
    const summaryPercentage = document.getElementById('summaryPercentage');
    if (summaryCompleted) summaryCompleted.textContent = String(progress.completed);
    if (summaryOutstanding) summaryOutstanding.textContent = String(progress.outstanding);
    if (summaryPercentage) summaryPercentage.textContent = `${progress.percentage}%`;

    renderTasks();
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;

    const state = getState();
    const search = document.getElementById('taskSearch')?.value.trim().toLowerCase() || '';
    const filterValue = document.getElementById('taskFilter')?.value || 'all';
    const sortValue = document.getElementById('taskSort')?.value || 'newest';

    let visibleTasks = [...state.tasks];

    if (search) {
        visibleTasks = visibleTasks.filter((task) => task.title.toLowerCase().includes(search) || task.description.toLowerCase().includes(search));
    }

    if (filterValue === 'completed') {
        visibleTasks = visibleTasks.filter((task) => task.completed || task.status === 'Completed');
    }

    if (filterValue === 'pending') {
        visibleTasks = visibleTasks.filter((task) => !task.completed && task.status !== 'Completed');
    }

    visibleTasks.sort((a, b) => {
        if (sortValue === 'due-date') {
            return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (sortValue === 'priority') {
            const order = { High: 3, Medium: 2, Low: 1 };
            return order[b.priority] - order[a.priority];
        }
        return new Date(b.dueDate) - new Date(a.dueDate);
    });

    if (!visibleTasks.length) {
        taskList.innerHTML = '<p class="empty-state">No tasks match this filter yet.</p>';
        return;
    }

    taskList.innerHTML = visibleTasks.map((task) => {
        const isComplete = task.completed || task.status === 'Completed';
        return `
      <article class="task-card ${isComplete ? 'completed' : ''}">
        <input class="task-check" type="checkbox" data-task-action="toggle" data-task-id="${task.id}" ${isComplete ? 'checked' : ''} aria-label="Toggle task completion" />
        <div class="task-info">
          <h3>${task.title}</h3>
          <div class="task-meta">
            <span>${task.dueDate}</span>
            <span class="task-badge ${task.priority.toLowerCase()}">${task.priority}</span>
            <span>${isComplete ? 'Completed' : 'Outstanding'}</span>
          </div>
          <p>${task.description || 'No description provided.'}</p>
        </div>
        <div class="task-actions">
          <button class="task-button edit" type="button" data-task-action="edit" data-task-id="${task.id}">Edit</button>
          <button class="task-button delete" type="button" data-task-action="delete" data-task-id="${task.id}">Delete</button>
        </div>
      </article>
    `;
    }).join('');

    taskList.querySelectorAll('[data-task-action]').forEach((button) => {
        button.addEventListener('click', (event) => {
            const { action, taskId } = event.target.dataset;
            const task = getState().tasks.find((item) => item.id === taskId);
            if (!task) return;

            if (action === 'toggle') {
                task.completed = !task.completed;
                task.status = task.completed ? 'Completed' : 'Pending';
            }

            if (action === 'delete') {
                const confirmed = window.confirm('Delete this task permanently?');
                if (!confirmed) return;
                const nextState = getState();
                nextState.tasks = nextState.tasks.filter((item) => item.id !== taskId);
                saveState(nextState);
            }

            if (action === 'edit') {
                const titleInput = document.getElementById('taskTitle');
                const dueInput = document.getElementById('taskDueDate');
                const priorityInput = document.getElementById('taskPriority');
                const statusInput = document.getElementById('taskStatus');
                const descriptionInput = document.getElementById('taskDescription');

                titleInput.value = task.title;
                dueInput.value = task.dueDate;
                priorityInput.value = task.priority;
                statusInput.value = task.status;
                descriptionInput.value = task.description || '';

                const existingTaskButton = document.querySelector('#taskForm button[type="submit"]');
                existingTaskButton.dataset.editingTaskId = taskId;
                existingTaskButton.textContent = 'Update task';
            }

            const state = getState();
            saveState(state);
            renderDashboard();
        });
    });

    taskList.querySelectorAll('.task-check').forEach((checkbox) => {
        checkbox.addEventListener('change', (event) => {
            const id = event.target.dataset.taskId;
            const state = getState();
            const task = state.tasks.find((item) => item.id === id);
            if (!task) return;
            task.completed = event.target.checked;
            task.status = event.target.checked ? 'Completed' : 'Pending';
            saveState(state);
            renderDashboard();
        });
    });
}

function handleTaskSubmit(event) {
    event.preventDefault();
    const state = getState();
    const title = document.getElementById('taskTitle').value.trim();
    const dueDate = document.getElementById('taskDueDate').value;
    const priority = document.getElementById('taskPriority').value;
    const status = document.getElementById('taskStatus').value;
    const description = document.getElementById('taskDescription').value.trim();
    const submitButton = document.querySelector('#taskForm button[type="submit"]');
    const editingTaskId = submitButton?.dataset.editingTaskId;

    if (!title || !dueDate) {
        return;
    }

    if (editingTaskId) {
        const task = state.tasks.find((item) => item.id === editingTaskId);
        if (task) {
            task.title = title;
            task.dueDate = dueDate;
            task.priority = priority;
            task.status = status;
            task.description = description;
            task.completed = status === 'Completed';
        }
        delete submitButton.dataset.editingTaskId;
        submitButton.textContent = 'Save task';
    } else {
        state.tasks.push({
            id: `task-${Date.now()}`,
            title,
            dueDate,
            priority,
            status,
            description,
            completed: status === 'Completed'
        });
    }

    saveState(state);
    event.target.reset();
    renderDashboard();
}

function handleBookingSubmit(event) {
    event.preventDefault();
    const date = document.getElementById('bookingDate').value;
    const type = document.getElementById('bookingType').value;
    const notes = document.getElementById('bookingNotes').value.trim();
    const output = document.getElementById('bookingStatus');

    if (!date || !notes) {
        output.textContent = 'Please complete all fields before booking a session.';
        output.className = 'booking-status error';
        return;
    }

    const state = getState();
    const booking = {
        id: `booking-${Date.now()}`,
        date,
        type,
        notes,
        status: 'Confirmed'
    };

    state.bookings.push(booking);
    saveState(state);

    output.textContent = `Booking confirmed for ${type} on ${date}.`;
    output.className = 'booking-status success';
    event.target.reset();
}

function setupGame() {
    const gameArea = document.getElementById('gameArea');
    const scoreNode = document.getElementById('gameScore');
    const startButton = document.getElementById('startGame');
    const gamePrompt = document.getElementById('gamePrompt');
    const gameOptions = document.getElementById('gameOptions');
    const gameFeedback = document.getElementById('gameFeedback');

    if (!gameArea || !scoreNode || !startButton || !gamePrompt || !gameOptions || !gameFeedback) return;

    const questions = [
        {
            question: 'A learner has a project due today, a short quiz due tomorrow, and a support booking request. Which should they deal with first?',
            options: [
                { text: 'The project due today, then the quiz, then the booking request.', correct: true, explanation: 'Urgent deadlines should be handled first, then the next important task, and support can be booked once the immediate work is under control.' },
                { text: 'Book the support session first and ignore the project.', correct: false, explanation: 'Support is useful, but it should not replace urgent deadlines that affect submission.' },
                { text: 'Do the easiest task first and hope the rest sorts itself out.', correct: false, explanation: 'Starting with the easiest task often delays the most important work.' },
                { text: 'Leave everything until the due date and panic later.', correct: false, explanation: 'Procrastination increases stress and makes the workload harder to manage.' }
            ]
        },
        {
            question: 'A learner is behind on tasks and feels overwhelmed. What is the best next step?',
            options: [
                { text: 'Break the work into smaller steps and start with one achievable task.', correct: true, explanation: 'Chunking work into manageable steps reduces overwhelm and makes progress visible.' },
                { text: 'Skip the task list and start a completely new activity.', correct: false, explanation: 'New work without a plan adds more confusion and keeps the learner off track.' },
                { text: 'Complete every task at once without planning.', correct: false, explanation: 'Trying to do everything at once usually leads to errors and missed deadlines.' },
                { text: 'Cancel everything and take a full week off.', correct: false, explanation: 'Rest is useful, but a plan is still needed to recover progress.' }
            ]
        },
        {
            question: 'When is it most useful to book a support session?',
            options: [
                { text: 'When you have already identified the exact problem and want guided help.', correct: true, explanation: 'Support is most effective when the learner knows what they need help with and wants actionable advice.' },
                { text: 'Only after the deadline has passed.', correct: false, explanation: 'Waiting until after a deadline makes the support too late to help prevent problems.' },
                { text: 'Right before every task begins, regardless of need.', correct: false, explanation: 'Booking support without a clear need wastes time and can distract from the real goal.' },
                { text: 'When you have no tasks left to do.', correct: false, explanation: 'Support is most valuable when it helps solve a current challenge, not after the work is finished.' }
            ]
        }
    ];

    let score = 0;
    let currentIndex = 0;

    function showQuestion() {
        if (currentIndex >= questions.length) {
            const total = questions.length;
            const message = score === total
                ? 'Excellent work. You understand how to prioritise learning tasks and use support effectively.'
                : score >= 2
                    ? 'Good job. You are thinking strategically about deadlines and support.'
                    : 'Keep practising. Focus on task urgency, small steps, and asking for support early.';

            gamePrompt.textContent = `${message} Final score: ${score}/${total}`;
            gameOptions.innerHTML = '';
            gameFeedback.textContent = 'Challenge complete. Press Start challenge to play again.';
            gameFeedback.className = 'game-feedback';
            return;
        }

        const current = questions[currentIndex];
        gamePrompt.textContent = current.question;
        gameOptions.innerHTML = '';
        gameFeedback.textContent = '';
        gameFeedback.className = 'game-feedback';

        current.options.forEach((option) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'secondary-button full-width';
            button.textContent = option.text;

            button.addEventListener('click', () => {
                const isCorrect = option.correct;
                score += isCorrect ? 1 : 0;
                scoreNode.textContent = String(score);

                gameFeedback.textContent = isCorrect
                    ? `Correct! ${option.explanation}`
                    : `Not quite. ${current.options.find((item) => item.correct).explanation}`;
                gameFeedback.className = `game-feedback ${isCorrect ? 'success' : 'error'}`;

                Array.from(gameOptions.children).forEach((child) => {
                    child.disabled = true;
                });

                setTimeout(() => {
                    currentIndex += 1;
                    showQuestion();
                }, 1200);
            });

            gameOptions.appendChild(button);
        });
    }

    startButton.addEventListener('click', () => {
        score = 0;
        currentIndex = 0;
        scoreNode.textContent = '0';
        showQuestion();
    });
}

function handleLogout() {
    const auth = getAuthClient();

    if (auth) {
        auth.signOut()
            .then(() => {
                const state = getState();
                state.session = null;
                saveState(state);
                window.location.href = '../index.html';
            })
            .catch(() => {
                const state = getState();
                state.session = null;
                saveState(state);
                window.location.href = '../index.html';
            });
        return;
    }

    const state = getState();
    state.session = null;
    saveState(state);
    window.location.href = '../index.html';
}

function attachDashboardEvents() {
    const taskSearch = document.getElementById('taskSearch');
    const taskFilter = document.getElementById('taskFilter');
    const taskSort = document.getElementById('taskSort');
    const taskForm = document.getElementById('taskForm');
    const bookingForm = document.getElementById('bookingForm');
    const logoutButton = document.getElementById('logoutButton');
    const printSummary = document.getElementById('printSummary');

    if (taskSearch) taskSearch.addEventListener('input', renderTasks);
    if (taskFilter) taskFilter.addEventListener('change', renderTasks);
    if (taskSort) taskSort.addEventListener('change', renderTasks);
    if (taskForm) taskForm.addEventListener('submit', handleTaskSubmit);
    if (bookingForm) bookingForm.addEventListener('submit', handleBookingSubmit);
    if (logoutButton) logoutButton.addEventListener('click', handleLogout);
    if (printSummary) printSummary.addEventListener('click', () => window.print());
}

function initPage() {
    const page = document.body.dataset.page;

    if (page === 'landing') {
        renderLandingStats();
        return;
    }

    if (page === 'login') {
        setupAuthTabs();
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        if (loginForm) loginForm.addEventListener('submit', handleLoginSubmit);
        if (registerForm) registerForm.addEventListener('submit', handleRegisterSubmit);
        return;
    }

    if (page === 'dashboard') {
        ensureSession();
        renderDashboard();
        attachDashboardEvents();
        setupGame();
    }
}

document.addEventListener('DOMContentLoaded', initPage);
