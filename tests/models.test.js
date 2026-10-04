const test = require('node:test');
const assert = require('node:assert/strict');
const { User, Task, Booking, calculateProgress } = require('../backend/models');

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

