class User {
    constructor(uid, displayName, email) {
        this.uid = uid;
        this.displayName = displayName;
        this.email = email;
        this.tasks = [];
        this.bookings = [];
    }

    addTask(task) {
        if (task.userId !== this.uid) {
            throw new Error('Task belongs to a different user');
        }
        this.tasks.push(task);
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

function calculateProgress(tasks) {
    const completed = tasks.filter((task) => task.completed).length;
    const total = tasks.length;
    const outstanding = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, outstanding, percentage };
}

module.exports = { User, Task, calculateProgress };
