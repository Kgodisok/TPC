const test = require('node:test');
const assert = require('node:assert/strict');
const { User, Task, calculateProgress } = require('../backend/models');

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
