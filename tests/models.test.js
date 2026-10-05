const test = require('node:test');
const assert = require('node:assert/strict');
const { User, Task, Booking, calculateProgress } = require('../backend/models');
const { validatePassword, registerUser, loginUser, validateSession } = require('../backend/auth');
const { normalizeTask, createTask, updateTask, deleteTask } = require('../backend/database');
const { firebaseApp, auth, database } = require('../backend/firebase');
const { getLandingHighlights, formatStatValue } = require('../backend/landingPage');
const { app } = require('../backend/app');

test('a user owns tasks with the matching user ID', () => {
    const user = new User('user-1', 'Learner', 'learner@example.com');
    const task = new Task('Finish project', '2026-08-30', user.uid);

    user.addTask(task);

    assert.equal(user.tasks.length, 1);
    assert.equal(user.tasks[0].userId, user.uid);
});

test('a task can be marked complete', () => {
    const task = new Task('Read brief', '2026-08-22', 'user-1');

    task.markComplete();

    assert.equal(task.completed, true);
});

test('progress is zero when there are no tasks', () => {
    assert.deepEqual(calculateProgress([]), {
        total: 0,
        completed: 0,
        outstanding: 0,
        percentage: 0
    });
});

test('progress counts completed and outstanding tasks', () => {
    const tasks = [
        new Task('One', '2026-08-22', 'user-1'),
        new Task('Two', '2026-08-23', 'user-1'),
        new Task('Three', '2026-08-24', 'user-1')
    ];
    tasks[0].markComplete();

    assert.deepEqual(calculateProgress(tasks), {
        total: 3,
        completed: 1,
        outstanding: 2,
        percentage: 33
    });
});

test('a user can calculate progress using their task list', () => {
    const user = new User('user-2', 'Coach', 'coach@example.com');
    user.addTask(new Task('Write plan', '2026-08-21', user.uid));
    user.addTask(new Task('Submit review', '2026-08-28', user.uid));
    user.tasks[0].markComplete();

    assert.deepEqual(user.getProgress(), {
        total: 2,
        completed: 1,
        outstanding: 1,
        percentage: 50
    });
});

test('a task can detect overdue work and update details', () => {
    const task = new Task('Finish module', '2026-08-15', 'user-3');

    assert.equal(task.isOverdue(), true);

    task.updateDetails({ title: 'Finish module 2', status: 'In Progress' });
    assert.equal(task.title, 'Finish module 2');
    assert.equal(task.status, 'In Progress');
});

test('bookings track confirmation lifecycle state', () => {
    const booking = new Booking('user-99', '2026-09-10', 'Career advice');

    assert.equal(booking.status, 'Pending');
    booking.confirm();
    assert.equal(booking.status, 'Confirmed');
    booking.complete();
    assert.equal(booking.status, 'Completed');
    booking.cancel();
    assert.equal(booking.status, 'Cancelled');
});

test('password validation enforces minimum strength requirements', () => {
    assert.equal(validatePassword('short'), false);
    assert.equal(validatePassword('ValidPass123'), true);
});

test('auth registration and login produce a valid session', () => {
    const user = registerUser({
        displayName: 'Taylor',
        email: 'taylor@example.com',
        password: 'ValidPass123'
    });

    assert.equal(user.email, 'taylor@example.com');
    const session = loginUser({ email: 'taylor@example.com', password: 'ValidPass123' });
    assert.ok(session && session.userId === user.id);
    assert.equal(validateSession(session.sessionId), true);
});

test('auth registration rejects names that are not strings or contain numbers', () => {
    assert.throws(() => registerUser({
        displayName: 123,
        email: 'numeric.type@example.com',
        password: 'ValidPass123'
    }), /Display name is required/);
    assert.throws(() => registerUser({
        displayName: 'Taylor2',
        email: 'numeric.name@example.com',
        password: 'ValidPass123'
    }), /must not contain numbers/);
});

test('database helpers normalize and update tasks', () => {
    const task = normalizeTask({
        title: 'Review report',
        dueDate: '2026-10-10',
        userId: 'user-1',
        description: 'Prepare notes',
        priority: 'high'
    });

    assert.equal(task.priority, 'High');
    assert.equal(task.status, 'Pending');

    const saved = createTask(task);
    const updated = updateTask(saved.id, { status: 'Completed', completed: true });
    assert.equal(updated.status, 'Completed');

    const removed = deleteTask(saved.id);
    assert.equal(removed, true);
});

test('firebase config exposes initialized services', () => {
    assert.ok(firebaseApp);
    assert.ok(auth);
    assert.ok(database);
});

test('landing page stats are shaped for display', () => {
    const highlights = getLandingHighlights();
    const value = formatStatValue(88, 'progress');

    assert.ok(Array.isArray(highlights));
    assert.equal(value, '88%');
});

test('server exposes auth and task API routes', async () => {
    const server = app.listen(0);

    try {
        const authResponse = await fetch(`http://127.0.0.1:${server.address().port}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                displayName: 'API Tester',
                email: 'api.tester@example.com',
                password: 'StrongPass123'
            })
        });

        assert.equal(authResponse.status, 201);
        const authBody = await authResponse.json();
        assert.equal(authBody.user.email, 'api.tester@example.com');

        const taskResponse = await fetch(`http://127.0.0.1:${server.address().port}/api/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'Build API flow',
                dueDate: '2026-10-20',
                userId: 'api-user',
                description: 'Complete the server route',
                priority: 'High'
            })
        });

        assert.equal(taskResponse.status, 201);
        const taskBody = await taskResponse.json();
        assert.equal(taskBody.task.title, 'Build API flow');
    } finally {
        await new Promise((resolve) => server.close(resolve));
    }
});

