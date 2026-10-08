const FIREBASE_CONFIG = {
    apiKey: 'AIzaSyDB3_eMS2salfFQOX32QuWnWy7rD5xHvJo',
    authDomain: 'tpc-project-ad914.firebaseapp.com',
    projectId: 'tpc-project-ad914',
    storageBucket: 'tpc-project-ad914.firebasestorage.app',
    messagingSenderId: '734459117823',
    appId: '1:734459117823:web:ebd27373a4c699c6e60cca'
};

let currentUser = null;
let tasks = [];
let bookings = [];
let stopTaskListener = null;
let stopBookingListener = null;
let stopAssessorLearnerListener = null;
let stopAssessorTaskListener = null;
let assessorLearners = [];
let assessorTasks = [];
let selectedAssessorLearnerId = '';
let redirectAfterSignOut = false;
let activeLoadingOperations = 0;

function setPageLoading(isLoading, message = 'Please wait...') {
    const loader = document.getElementById('pageLoader');
    const loaderMessage = document.getElementById('pageLoaderMessage');
    if (!loader) return;

    if (loaderMessage) loaderMessage.textContent = message;
    loader.hidden = !isLoading;
    document.body.setAttribute('aria-busy', String(isLoading));
}

async function withPageLoading(message, operation) {
    activeLoadingOperations += 1;
    setPageLoading(true, message);

    try {
        return await operation();
    } finally {
        activeLoadingOperations = Math.max(0, activeLoadingOperations - 1);
        if (activeLoadingOperations === 0) {
            setPageLoading(false);
        }
    }
}

function getFirebaseConfig() {
    if (window.__FIREBASE_CONFIG__) {
        return { ...FIREBASE_CONFIG, ...window.__FIREBASE_CONFIG__ };
    }

    return FIREBASE_CONFIG;
}

function isFirebaseReady() {
    const config = getFirebaseConfig();
    return Boolean(window.firebase && config.apiKey && config.projectId);
}

function getFirebaseApp() {
    if (!isFirebaseReady()) {
        return null;
    }

    if (!window.firebase.apps.length) {
        return window.firebase.initializeApp(getFirebaseConfig());
    }

    return window.firebase.app();
}

function getAuthClient() {
    const app = getFirebaseApp();
    return app ? window.firebase.auth(app) : null;
}

function getFirestoreClient() {
    const app = getFirebaseApp();
    return app && window.firebase.firestore ? window.firebase.firestore(app) : null;
}

function userDocument(user = currentUser) {
    return window.firestoreDb.collection('users').doc(user.uid);
}

function userCollection(name) {
    if (!currentUser || !window.firestoreDb) {
        throw new Error('Sign in is required to access learner data.');
    }

    return userDocument().collection(name);
}

function showDashboardMessage(message, type = 'error') {
    const node = document.getElementById('dashboardStatus');
    if (!node) return;
    node.textContent = message;
    node.className = `dashboard-status ${type}`;
}

function calculateProgress(tasks) {
    const completed = tasks.filter((task) => task.completed || task.status === 'Completed').length;
    const total = tasks.length;
    const outstanding = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, outstanding, percentage };
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

function updatePasswordFeedback() {
    const password = document.getElementById('registerPassword')?.value || '';
    const feedback = document.getElementById('passwordRequirements');
    if (!feedback) return;

    const requirements = [
        [password.length >= 8, 'at least 8 characters'],
        [password.length <= 128, 'no more than 128 characters'],
        [/[A-Z]/.test(password), 'an uppercase letter'],
        [/[a-z]/.test(password), 'a lowercase letter'],
        [/\d/.test(password), 'a number'],
        [/[^A-Za-z0-9\s]/.test(password), 'a symbol']
    ];
    const missing = requirements.filter(([met]) => !met).map(([, message]) => message);

    if (!password) {
        feedback.textContent = 'Use at least 8 characters, with uppercase and lowercase letters, a number, and a symbol (128 max).';
        feedback.classList.remove('error', 'success');
        return;
    }

    if (missing.length) {
        feedback.textContent = `Password still needs ${missing.join(', ')}.`;
        feedback.classList.add('error');
        feedback.classList.remove('success');
        return;
    }

    feedback.textContent = 'Password meets all requirements.';
    feedback.classList.add('success');
    feedback.classList.remove('error');
}

function redirectToDashboard() {
    window.location.href = '/public/dashboard.html';
}

function redirectForAccount(role, accountStatus) {
    if (role !== 'assessor') {
        redirectToDashboard();
        return;
    }

    const destination = accountStatus === 'approved'
        ? '/public/assessor-dashboard.html'
        : '/public/assessor-pending.html';
    window.location.href = destination;
}

function isValidDisplayName(name) {
    return name.length >= 2
        && name.length <= 60
        && /^[\p{L}][\p{L}\p{M}]*(?:[ '\u2019-][\p{L}][\p{L}\p{M}]*)*$/u.test(name);
}

function isValidEmail(email) {
    if (email.length > 254) return false;

    const parts = email.split('@');
    if (parts.length !== 2) return false;

    const [localPart, domain] = parts;
    if (!localPart || localPart.length > 64 || localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
        return false;
    }

    if (!/^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(localPart)) return false;

    const domainLabels = domain.split('.');
    if (domainLabels.length < 2 || domainLabels.some((label) => (
        label.length > 63 || !/^[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?$/i.test(label)
    ))) {
        return false;
    }

    const topLevelDomain = domainLabels[domainLabels.length - 1];
    return /^[A-Z]{2,63}$/i.test(topLevelDomain) || /^xn--[A-Z0-9-]{2,59}$/i.test(topLevelDomain);
}

function isValidPassword(password) {
    return password.length >= 8
        && password.length <= 128
        && /[A-Z]/.test(password)
        && /[a-z]/.test(password)
        && /\d/.test(password)
        && /[^A-Za-z0-9\s]/.test(password);
}

function describeFirebaseError(error, action) {
    const messages = {
        'auth/email-already-in-use': 'An account already exists for this email. Sign in instead.',
        'auth/invalid-credential': 'The email or password is incorrect.',
        'auth/invalid-email': 'Enter a valid email address.',
        'auth/operation-not-allowed': 'Email and password sign-in is not enabled for this Firebase project.',
        'auth/weak-password': 'Choose a stronger password with at least 8 characters.',
        'auth/network-request-failed': 'Connection failed. Check your internet connection and try again.',
        'permission-denied': 'Your account could not access StarSchools data. Please try again or contact support.'
    };

    return messages[error.code] || error.message || `Unable to ${action}. Please try again.`;
}

async function handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const selectedRole = document.getElementById('loginRole').value;
    const auth = getAuthClient();
    const firestore = getFirestoreClient();

    if (!auth || !firestore) {
        setAuthMessage('The StarSchools sign-in service is unavailable. Please try again later.', 'error');
        return;
    }

    try {
        const { role, accountStatus } = await withPageLoading('Signing in to your StarSchools account...', async () => {
            const credential = await auth.signInWithEmailAndPassword(email, password);
            const profile = await firestore.collection('users').doc(credential.user.uid).get();
            const role = profile.data()?.role || 'learner';
            const accountStatus = profile.data()?.accountStatus || (role === 'assessor' ? 'pending' : 'approved');
            return { role, accountStatus };
        });

        if (selectedRole !== role) {
            await auth.signOut();
            const expectedRole = role === 'assessor' ? 'Assessor' : 'Learner';
            setAuthMessage(`This account is registered as a ${expectedRole.toLowerCase()}. Select ${expectedRole} to sign in.`, 'error');
            return;
        }

        const message = role === 'assessor' && accountStatus !== 'approved'
            ? 'Your assessor account is awaiting StarSchools approval.'
            : 'Sign-in successful. Opening your StarSchools dashboard...';
        setAuthMessage(message, 'success');
        setTimeout(() => redirectForAccount(role, accountStatus), 900);
    } catch (error) {
        if (auth.currentUser) await auth.signOut();
        setAuthMessage(describeFirebaseError(error, 'sign in'), 'error');
    }
}

async function handleRegisterSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value.trim().replace(/\s+/g, ' ');
    const role = document.getElementById('registerRole').value;
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;

    if (!name || !role || !email || !password) {
        setAuthMessage('Please complete every field before creating an account.', 'error');
        return;
    }

    if (!['learner', 'assessor'].includes(role)) {
        setAuthMessage('Select Learner or Assessor as your account type.', 'error');
        return;
    }

    if (!isValidDisplayName(name)) {
        setAuthMessage('Enter a name using 2-60 letters. Spaces, apostrophes, and hyphens are allowed.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        setAuthMessage('Enter a valid email address, such as name@example.com.', 'error');
        return;
    }

    if (!isValidPassword(password)) {
        setAuthMessage('Password must be at least 8 characters and include uppercase and lowercase letters, a number, and a symbol (128 characters maximum).', 'error');
        return;
    }

    const auth = getAuthClient();
    const firestore = getFirestoreClient();
    if (!auth || !firestore) {
        setAuthMessage('The StarSchools account service is unavailable. Please try again later.', 'error');
        return;
    }

    try {
        await withPageLoading('Creating your StarSchools account...', async () => {
            const credential = await auth.createUserWithEmailAndPassword(email, password);
            const user = credential.user;
            await user.updateProfile({ displayName: name });
            await firestore.collection('users').doc(user.uid).set({
                displayName: name,
                email: user.email,
                role,
                accountStatus: role === 'assessor' ? 'pending' : 'approved',
                createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
            });
            if (role === 'learner') {
                await ensureLearnerDirectory(user, name);
            }
        });

        const accountStatus = role === 'assessor' ? 'pending' : 'approved';
        const message = role === 'assessor'
            ? 'Your assessor account was created. StarSchools approval is required before student records are available.'
            : 'Your StarSchools account was created successfully. Opening your dashboard...';
        setAuthMessage(message, 'success');
        setTimeout(() => redirectForAccount(role, accountStatus), 900);
    } catch (error) {
        setAuthMessage(describeFirebaseError(error, 'create your account'), 'error');
    }
}

function getCurrentUser() {
    if (!currentUser) return null;
    return {
        id: currentUser.uid,
        name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Learner',
        email: currentUser.email
    };
}

async function ensureUserProfile(user) {
    const profileRef = userDocument(user);
    const profileSnapshot = await profileRef.get();
    const profile = profileSnapshot.data() || {};
    const displayName = user.displayName || profile.displayName || 'Learner';
    const email = user.email || profile.email || '';
    const role = profile.role || 'learner';
    const accountStatus = profile.accountStatus || (role === 'assessor' ? 'pending' : 'approved');

    if (!profileSnapshot.exists) {
        await profileRef.set({
            displayName,
            email,
            role,
            accountStatus,
            createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
        });
    } else {
        const updates = {};
        if (profile.displayName !== displayName) updates.displayName = displayName;
        if (profile.email !== email) updates.email = email;
        if (!profile.role) updates.role = role;
        if (!profile.accountStatus) updates.accountStatus = accountStatus;
        if (Object.keys(updates).length) {
            updates.updatedAt = window.firebase.firestore.FieldValue.serverTimestamp();
            await profileRef.update(updates);
        }
    }

    if (role === 'learner') {
        await ensureLearnerDirectory(user, displayName);
    }

    return { role, accountStatus, displayName };
}

async function ensureLearnerDirectory(user, displayName) {
    const directoryRef = window.firestoreDb.collection('learnerDirectory').doc(user.uid);
    const directorySnapshot = await directoryRef.get();
    const directoryData = {
        displayName,
        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
    };

    if (directorySnapshot.exists) {
        await directoryRef.update(directoryData);
        return;
    }

    directoryData.createdAt = window.firebase.firestore.FieldValue.serverTimestamp();
    await directoryRef.set(directoryData);
}

function renderDashboard() {
    const user = getCurrentUser();
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

    renderTasks();
    renderBookings();
}

function listenToUserData() {
    if (stopTaskListener) stopTaskListener();
    if (stopBookingListener) stopBookingListener();

    return new Promise((resolve) => {
        let tasksLoaded = false;
        let bookingsLoaded = false;
        const finishInitialLoad = () => {
            if (tasksLoaded && bookingsLoaded) resolve();
        };

        stopTaskListener = userCollection('tasks').onSnapshot((snapshot) => {
            tasks = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
            renderDashboard();
            tasksLoaded = true;
            finishInitialLoad();
        }, (error) => {
            showDashboardMessage(describeFirebaseError(error, 'load your tasks'));
            tasksLoaded = true;
            finishInitialLoad();
        });

        stopBookingListener = userCollection('bookings').onSnapshot((snapshot) => {
            bookings = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
            renderBookings();
            bookingsLoaded = true;
            finishInitialLoad();
        }, (error) => {
            showDashboardMessage(describeFirebaseError(error, 'load your support requests'));
            bookingsLoaded = true;
            finishInitialLoad();
        });
    });
}

function escapeHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;

    const search = document.getElementById('taskSearch')?.value.trim().toLowerCase() || '';
    const filterValue = document.getElementById('taskFilter')?.value || 'all';
    const sortValue = document.getElementById('taskSort')?.value || 'newest';

    let visibleTasks = [...tasks];

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
        return (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0);
    });

    if (!visibleTasks.length) {
        taskList.innerHTML = '<p class="empty-state">No tasks match this filter yet.</p>';
        return;
    }

    taskList.innerHTML = visibleTasks.map((task) => {
        const isComplete = task.completed || task.status === 'Completed';
        return `
      <article class="task-card ${isComplete ? 'completed' : ''}">
                <input class="task-check" type="checkbox" data-task-action="toggle" data-task-id="${escapeHtml(task.id)}" ${isComplete ? 'checked' : ''} aria-label="Toggle task completion" />
        <div class="task-info">
                    <h3>${escapeHtml(task.title)}</h3>
          <div class="task-meta">
                        <span>${escapeHtml(task.dueDate)}</span>
                        <span class="task-badge ${escapeHtml(task.priority.toLowerCase())}">${escapeHtml(task.priority)}</span>
            <span>${isComplete ? 'Completed' : 'Outstanding'}</span>
          </div>
                    <p>${escapeHtml(task.description || 'No description provided.')}</p>
        </div>
        <div class="task-actions">
                    <button class="task-button edit" type="button" data-task-action="edit" data-task-id="${escapeHtml(task.id)}">Edit</button>
                    <button class="task-button delete" type="button" data-task-action="delete" data-task-id="${escapeHtml(task.id)}">Delete</button>
        </div>
      </article>
    `;
    }).join('');
}

async function handleTaskSubmit(event) {
    event.preventDefault();
    const title = document.getElementById('taskTitle').value.trim();
    const dueDate = document.getElementById('taskDueDate').value;
    const priority = document.getElementById('taskPriority').value;
    const status = document.getElementById('taskStatus').value;
    const description = document.getElementById('taskDescription').value.trim();
    const submitButton = document.querySelector('#taskForm button[type="submit"]');
    const editingTaskId = submitButton?.dataset.editingTaskId;

    if (!title || !dueDate) {
        showDashboardMessage('Enter a task title and due date before saving.');
        return;
    }

    if (title.length > 120 || description.length > 1000) {
        showDashboardMessage('Task titles must be 120 characters or fewer, and descriptions 1,000 or fewer.');
        return;
    }

    const taskData = {
        title,
        dueDate,
        priority,
        status,
        description,
        completed: status === 'Completed',
        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        await withPageLoading(editingTaskId ? 'Updating your task...' : 'Saving your task...', async () => {
            if (editingTaskId) {
                await userCollection('tasks').doc(editingTaskId).update(taskData);
                delete submitButton.dataset.editingTaskId;
                submitButton.textContent = 'Save task';
            } else {
                await userCollection('tasks').add({
                    ...taskData,
                    createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        });
        showDashboardMessage(editingTaskId ? 'Task updated successfully.' : 'Task saved successfully.', 'success');
        event.target.reset();
    } catch (error) {
        showDashboardMessage(describeFirebaseError(error, 'save your task'));
    }
}

async function handleTaskAction(event) {
    const button = event.target.closest('button[data-task-action]');
    if (!button) return;

    const task = tasks.find((item) => item.id === button.dataset.taskId);
    if (!task) return;

    if (button.dataset.taskAction === 'edit') {
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDueDate').value = task.dueDate;
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskStatus').value = task.status;
        document.getElementById('taskDescription').value = task.description || '';

        const submitButton = document.querySelector('#taskForm button[type="submit"]');
        submitButton.dataset.editingTaskId = task.id;
        submitButton.textContent = 'Update task';
        document.getElementById('taskTitle').focus();
        return;
    }

    if (button.dataset.taskAction === 'delete' && window.confirm('Permanently delete this task?')) {
        try {
            await withPageLoading('Deleting your task...', () => userCollection('tasks').doc(task.id).delete());
            showDashboardMessage('Task deleted successfully.', 'success');
        } catch (error) {
            showDashboardMessage(describeFirebaseError(error, 'delete your task'));
        }
    }
}

async function handleTaskToggle(event) {
    const checkbox = event.target.closest('input[data-task-action="toggle"]');
    if (!checkbox) return;

    const completed = checkbox.checked;
    try {
        await withPageLoading(completed ? 'Updating task status...' : 'Updating task status...', () => userCollection('tasks').doc(checkbox.dataset.taskId).update({
            completed,
            status: completed ? 'Completed' : 'Pending',
            updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
        }));
        showDashboardMessage(completed ? 'Task marked complete.' : 'Task marked outstanding.', 'success');
    } catch (error) {
        checkbox.checked = !completed;
        showDashboardMessage(describeFirebaseError(error, 'update your task'));
    }
}

function renderBookings() {
    const bookingList = document.getElementById('bookingList');
    if (!bookingList) return;
    bookingList.replaceChildren();

    if (!bookings.length) {
        const emptyState = document.createElement('p');
        emptyState.className = 'empty-state';
        emptyState.textContent = 'You have no support requests yet.';
        bookingList.appendChild(emptyState);
        return;
    }

    [...bookings]
        .sort((a, b) => a.date.localeCompare(b.date))
        .forEach((booking) => {
            const row = document.createElement('article');
            row.className = 'booking-row';

            const details = document.createElement('div');
            const title = document.createElement('strong');
            title.textContent = booking.type;
            const date = document.createElement('p');
            date.textContent = `${booking.date} · ${booking.status}`;
            const notes = document.createElement('p');
            notes.textContent = booking.notes;
            details.append(title, date, notes);

            const cancelButton = document.createElement('button');
            cancelButton.type = 'button';
            cancelButton.className = 'task-button delete';
            cancelButton.textContent = 'Cancel request';
            cancelButton.dataset.bookingId = booking.id;
            row.append(details, cancelButton);
            bookingList.appendChild(row);
        });
}

function showAssessorMessage(message, type = 'error') {
    const node = document.getElementById('assessorStatus');
    if (!node) return;
    node.textContent = message;
    node.className = `dashboard-status ${type}`;
}

function getAssessorProgress(learnerId) {
    return calculateProgress(assessorTasks.filter((task) => task.userId === learnerId));
}

function renderAssessorDashboard() {
    const totalTasks = assessorTasks.length;
    const completedTasks = assessorTasks.filter((task) => task.completed || task.status === 'Completed').length;
    const learnerCount = document.getElementById('assessorLearnerCount');
    const taskCount = document.getElementById('assessorTaskCount');
    const completedCount = document.getElementById('assessorCompletedCount');
    const outstandingCount = document.getElementById('assessorOutstandingCount');
    if (learnerCount) learnerCount.textContent = String(assessorLearners.length);
    if (taskCount) taskCount.textContent = String(totalTasks);
    if (completedCount) completedCount.textContent = String(completedTasks);
    if (outstandingCount) outstandingCount.textContent = String(totalTasks - completedTasks);

    const search = document.getElementById('assessorLearnerSearch')?.value.trim().toLowerCase() || '';
    const learnerTable = document.getElementById('assessorLearnerTable');
    if (learnerTable) {
        const visibleLearners = assessorLearners.filter((learner) => learner.displayName.toLowerCase().includes(search));
        learnerTable.innerHTML = visibleLearners.length
            ? visibleLearners.map((learner) => {
                const progress = getAssessorProgress(learner.id);
                return `
                    <tr>
                      <td>${escapeHtml(learner.displayName)}</td>
                      <td>${progress.total}</td>
                      <td>${progress.completed}</td>
                      <td>
                        <div class="assessor-progress-track" aria-label="${progress.percentage}% complete">
                          <span style="width: ${progress.percentage}%"></span>
                        </div>
                        <strong>${progress.percentage}%</strong>
                      </td>
                      <td><button class="task-button edit" type="button" data-assessor-view="${escapeHtml(learner.id)}">View tasks</button></td>
                    </tr>
                `;
            }).join('')
            : '<tr><td colspan="5">No learners found.</td></tr>';
    }

    const learnerSelect = document.getElementById('assessorTaskLearner');
    if (learnerSelect) {
        const previousValue = learnerSelect.value;
        learnerSelect.innerHTML = '<option value="">Select a learner</option>' + assessorLearners.map((learner) => (
            `<option value="${escapeHtml(learner.id)}">${escapeHtml(learner.displayName)}</option>`
        )).join('');
        learnerSelect.value = assessorLearners.some((learner) => learner.id === previousValue)
            ? previousValue
            : '';
    }

    renderAssessorTasks();
}

function renderAssessorTasks() {
    const selectedLearner = assessorLearners.find((learner) => learner.id === selectedAssessorLearnerId);
    const learnerName = document.getElementById('selectedAssessorLearnerName');
    const taskList = document.getElementById('assessorTaskList');
    if (learnerName) learnerName.textContent = selectedLearner?.displayName || 'Select a learner';
    if (!taskList) return;

    if (!selectedLearner) {
        taskList.innerHTML = '<p class="empty-state">Choose a learner to review their tasks.</p>';
        return;
    }

    const learnerTasks = assessorTasks.filter((task) => task.userId === selectedLearner.id);
    if (!learnerTasks.length) {
        taskList.innerHTML = '<p class="empty-state">This learner has no tasks yet. You can assign one below.</p>';
        return;
    }

    taskList.innerHTML = learnerTasks.map((task) => {
        const isComplete = task.completed || task.status === 'Completed';
        return `
            <article class="task-card ${isComplete ? 'completed' : ''}">
              <div class="task-info">
                <h3>${escapeHtml(task.title)}</h3>
                <div class="task-meta">
                  <span>Due ${escapeHtml(task.dueDate)}</span>
                  <span class="task-badge ${escapeHtml(task.priority.toLowerCase())}">${escapeHtml(task.priority)}</span>
                  <span>${isComplete ? 'Completed' : 'Outstanding'}</span>
                </div>
                <p>${escapeHtml(task.description || 'No description provided.')}</p>
              </div>
              <div class="task-actions">
                <button class="task-button edit" type="button" data-assessor-task-action="toggle" data-task-id="${escapeHtml(task.id)}">${isComplete ? 'Reopen task' : 'Mark complete'}</button>
                <button class="task-button delete" type="button" data-assessor-task-action="delete" data-task-id="${escapeHtml(task.id)}">Delete</button>
              </div>
            </article>
        `;
    }).join('');
}

function listenToAssessorData() {
    if (stopAssessorLearnerListener) stopAssessorLearnerListener();
    if (stopAssessorTaskListener) stopAssessorTaskListener();

    let learnersLoaded = false;
    let tasksLoaded = false;
    const finishLoading = () => {
        if (learnersLoaded && tasksLoaded) setPageLoading(false);
    };

    stopAssessorLearnerListener = window.firestoreDb.collection('learnerDirectory').onSnapshot((snapshot) => {
        assessorLearners = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }))
            .sort((left, right) => left.displayName.localeCompare(right.displayName));
        if (!assessorLearners.some((learner) => learner.id === selectedAssessorLearnerId)) {
            selectedAssessorLearnerId = '';
        }
        renderAssessorDashboard();
        learnersLoaded = true;
        finishLoading();
    }, (error) => {
        showAssessorMessage(describeFirebaseError(error, 'load learners'));
        learnersLoaded = true;
        finishLoading();
    });

    stopAssessorTaskListener = window.firestoreDb.collectionGroup('tasks').onSnapshot((snapshot) => {
        assessorTasks = snapshot.docs.map((document) => ({
            ...document.data(),
            id: document.id,
            userId: document.ref.parent.parent.id
        }));
        renderAssessorDashboard();
        tasksLoaded = true;
        finishLoading();
    }, (error) => {
        showAssessorMessage(describeFirebaseError(error, 'load learner tasks'));
        tasksLoaded = true;
        finishLoading();
    });
}

async function handleAssessorTaskSubmit(event) {
    event.preventDefault();
    const learnerId = document.getElementById('assessorTaskLearner').value;
    const title = document.getElementById('assessorTaskTitle').value.trim();
    const dueDate = document.getElementById('assessorTaskDueDate').value;
    const priority = document.getElementById('assessorTaskPriority').value;
    const description = document.getElementById('assessorTaskDescription').value.trim();

    if (!learnerId || !title || title.length > 120 || !dueDate || description.length > 1000) {
        showAssessorMessage('Select a learner, add a title and due date, and keep descriptions under 1,000 characters.');
        return;
    }

    try {
        await withPageLoading('Assigning learner task...', () => window.firestoreDb
            .collection('users').doc(learnerId).collection('tasks').add({
                title,
                dueDate,
                priority,
                status: 'Pending',
                description,
                completed: false,
                createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
            }));
        showAssessorMessage('Task assigned successfully.', 'success');
        event.target.reset();
    } catch (error) {
        showAssessorMessage(describeFirebaseError(error, 'assign the task'));
    }
}

async function handleAssessorTaskAction(event) {
    const button = event.target.closest('button[data-assessor-task-action]');
    if (!button) return;

    const task = assessorTasks.find((item) => item.id === button.dataset.taskId && item.userId === selectedAssessorLearnerId);
    if (!task) return;

    const taskRef = window.firestoreDb.collection('users').doc(task.userId).collection('tasks').doc(task.id);
    try {
        if (button.dataset.assessorTaskAction === 'delete') {
            if (!window.confirm('Permanently delete this learner task?')) return;
            await withPageLoading('Deleting learner task...', () => taskRef.delete());
            showAssessorMessage('Task deleted.', 'success');
            return;
        }

        const completed = !(task.completed || task.status === 'Completed');
        await withPageLoading('Updating learner task...', () => taskRef.update({
            completed,
            status: completed ? 'Completed' : 'Pending',
            updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
        }));
        showAssessorMessage(completed ? 'Task marked complete.' : 'Task reopened.', 'success');
    } catch (error) {
        showAssessorMessage(describeFirebaseError(error, 'update the learner task'));
    }
}

function attachAssessorDashboardEvents() {
    document.getElementById('logoutButton')?.addEventListener('click', handleLogout);
    document.getElementById('assessorLearnerSearch')?.addEventListener('input', renderAssessorDashboard);
    document.getElementById('assessorLearnerTable')?.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-assessor-view]');
        if (!button) return;
        selectedAssessorLearnerId = button.dataset.assessorView;
        const learnerSelect = document.getElementById('assessorTaskLearner');
        if (learnerSelect) learnerSelect.value = selectedAssessorLearnerId;
        renderAssessorTasks();
        document.getElementById('assessorTaskPanel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    document.getElementById('assessorTaskLearner')?.addEventListener('change', (event) => {
        selectedAssessorLearnerId = event.target.value;
        renderAssessorTasks();
    });
    document.getElementById('assessorTaskForm')?.addEventListener('submit', handleAssessorTaskSubmit);
    document.getElementById('assessorTaskList')?.addEventListener('click', handleAssessorTaskAction);
}

function initializeAssessorDashboard() {
    const auth = getAuthClient();
    if (!auth || !window.firestoreDb) {
        setPageLoading(false);
        return;
    }

    attachAssessorDashboardEvents();
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            window.location.replace('/public/login.html');
            return;
        }

        currentUser = user;
        try {
            const profile = await ensureUserProfile(user);
            if (profile.role !== 'assessor') {
                window.location.replace('/public/dashboard.html');
                return;
            }
            if (profile.accountStatus !== 'approved') {
                window.location.replace('/public/assessor-pending.html');
                return;
            }

            const welcomeName = document.getElementById('assessorWelcomeName');
            if (welcomeName) welcomeName.textContent = profile.displayName;
            setPageLoading(true, 'Loading learner progress...');
            listenToAssessorData();
        } catch (error) {
            setPageLoading(false);
            showAssessorMessage(describeFirebaseError(error, 'load the assessor dashboard'));
        }
    });
}

function initializeAssessorPending() {
    const auth = getAuthClient();
    if (!auth || !window.firestoreDb) {
        setPageLoading(false);
        return;
    }

    document.getElementById('logoutButton')?.addEventListener('click', handleLogout);
    document.getElementById('pendingLogoutButton')?.addEventListener('click', handleLogout);
    document.getElementById('checkApprovalButton')?.addEventListener('click', () => window.location.reload());
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            window.location.replace('/public/login.html');
            return;
        }

        currentUser = user;
        try {
            const profile = await ensureUserProfile(user);
            if (profile.role !== 'assessor') {
                window.location.replace('/public/dashboard.html');
                return;
            }
            if (profile.accountStatus === 'approved') {
                window.location.replace('/public/assessor-dashboard.html');
                return;
            }

            const name = document.getElementById('pendingAssessorName');
            if (name) name.textContent = profile.displayName;
            setPageLoading(false);
        } catch (error) {
            setPageLoading(false);
            const status = document.getElementById('pendingStatus');
            if (status) status.textContent = describeFirebaseError(error, 'check assessor approval');
        }
    });
}

async function handleBookingAction(event) {
    const button = event.target.closest('button[data-booking-id]');
    if (!button || !window.confirm('Cancel this support request?')) return;

    try {
        await withPageLoading('Cancelling your support request...', () => userCollection('bookings').doc(button.dataset.bookingId).delete());
        showDashboardMessage('Support request cancelled.', 'success');
    } catch (error) {
        showDashboardMessage(describeFirebaseError(error, 'cancel your request'));
    }
}

async function handleBookingSubmit(event) {
    event.preventDefault();
    const date = document.getElementById('bookingDate').value;
    const type = document.getElementById('bookingType').value;
    const notes = document.getElementById('bookingNotes').value.trim();
    const output = document.getElementById('bookingStatus');

    if (!date || notes.length < 5 || notes.length > 500) {
        output.textContent = 'Choose a date and enter notes between 5 and 500 characters.';
        output.className = 'booking-status error';
        return;
    }

    const selectedDate = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
        output.textContent = 'Choose today or a future date for your support request.';
        output.className = 'booking-status error';
        return;
    }

    try {
        await withPageLoading('Sending your support request...', () => userCollection('bookings').add({
            date,
            type,
            notes,
            status: 'Pending',
            createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
        }));
        output.textContent = `Your ${type} request was sent. StarSchools will confirm the session.`;
        output.className = 'booking-status success';
        event.target.reset();
    } catch (error) {
        output.textContent = describeFirebaseError(error, 'send your support request');
        output.className = 'booking-status error';
    }
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

async function handleLogout() {
    const auth = getAuthClient();
    if (!auth) {
        showDashboardMessage('The sign-out service is unavailable. Please reload and try again.');
        return;
    }

    try {
        redirectAfterSignOut = true;
        await withPageLoading('Signing out...', () => auth.signOut());
    } catch (error) {
        redirectAfterSignOut = false;
        showDashboardMessage(describeFirebaseError(error, 'sign out'));
    }
}

function attachDashboardEvents() {
    const taskSearch = document.getElementById('taskSearch');
    const taskFilter = document.getElementById('taskFilter');
    const taskSort = document.getElementById('taskSort');
    const taskForm = document.getElementById('taskForm');
    const bookingForm = document.getElementById('bookingForm');
    const taskList = document.getElementById('taskList');
    const bookingList = document.getElementById('bookingList');
    const logoutButton = document.getElementById('logoutButton');
    const printSummary = document.getElementById('printSummary');

    if (taskSearch) taskSearch.addEventListener('input', renderTasks);
    if (taskFilter) taskFilter.addEventListener('change', renderTasks);
    if (taskSort) taskSort.addEventListener('change', renderTasks);
    if (taskForm) taskForm.addEventListener('submit', handleTaskSubmit);
    if (bookingForm) bookingForm.addEventListener('submit', handleBookingSubmit);
    if (taskList) {
        taskList.addEventListener('click', handleTaskAction);
        taskList.addEventListener('change', handleTaskToggle);
    }
    if (bookingList) bookingList.addEventListener('click', handleBookingAction);
    if (logoutButton) logoutButton.addEventListener('click', handleLogout);
    if (printSummary) printSummary.addEventListener('click', () => window.print());
}

function initializeDashboard() {
    const auth = getAuthClient();
    if (!auth || !window.firestoreDb) {
        setPageLoading(false);
        showDashboardMessage('The StarSchools data service is unavailable. Please try again later.');
        return;
    }

    attachDashboardEvents();
    setPageLoading(true, 'Checking your StarSchools account...');
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            if (stopTaskListener) stopTaskListener();
            if (stopBookingListener) stopBookingListener();
            stopTaskListener = null;
            stopBookingListener = null;
            tasks = [];
            bookings = [];
            currentUser = null;
            activeLoadingOperations = 0;
            setPageLoading(false);
            window.location.replace(redirectAfterSignOut ? '/' : '/public/login.html');
            return;
        }

        currentUser = user;
        try {
            await withPageLoading('Loading your learner portal...', async () => {
                const profile = await ensureUserProfile(user);
                if (profile.role === 'assessor') {
                    window.location.replace(profile.accountStatus === 'approved'
                        ? '/public/assessor-dashboard.html'
                        : '/public/assessor-pending.html');
                    return;
                }
                await listenToUserData();
            });
        } catch (error) {
            showDashboardMessage(describeFirebaseError(error, 'load your learner profile'));
        }
    });
}

function initializeGame() {
    const auth = getAuthClient();
    if (!auth) {
        setPageLoading(false);
        return;
    }

    setupGame();
    document.getElementById('logoutButton')?.addEventListener('click', handleLogout);
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            window.location.replace('/public/login.html');
            return;
        }

        try {
            const profile = await ensureUserProfile(user);
            if (profile.role === 'assessor') {
                redirectForAccount(profile.role, profile.accountStatus);
                return;
            }
            setPageLoading(false);
        } catch (error) {
            setPageLoading(false);
        }
    });
}

function initPage() {
    const page = document.body.dataset.page;
    window.firestoreDb = getFirestoreClient();

    if (page === 'landing') {
        return;
    }

    if (page === 'login') {
        setupAuthTabs();
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        if (loginForm) loginForm.addEventListener('submit', handleLoginSubmit);
        if (registerForm) {
            registerForm.addEventListener('submit', handleRegisterSubmit);
            document.getElementById('registerPassword')?.addEventListener('input', updatePasswordFeedback);
        }
        return;
    }

    if (page === 'dashboard') {
        initializeDashboard();
        return;
    }

    if (page === 'game') {
        initializeGame();
        return;
    }

    if (page === 'assessor-dashboard') {
        initializeAssessorDashboard();
        return;
    }

    if (page === 'assessor-pending') {
        initializeAssessorPending();
    }
}

document.addEventListener('DOMContentLoaded', initPage);
