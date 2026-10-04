class User {
    constructor(uid, displayName, email, preferences = {}) {
        this.uid = uid;
        this.displayName = displayName;
        this.email = email;
        this.tasks = [];
        this.bookings = [];
        this.preferences = preferences;
    }

    addTask(task) {
        if (task.userId !== this.uid) {
            throw new Error('Task belongs to a different user');
        }
        this.tasks.push(task);
        return this;
    }

    getProgress() {
        return calculateProgress(this.tasks);
    }

    setPreference(key, value) {
        this.preferences[key] = value;
        return this.preferences;
    }
}

class Task {
    constructor(title, dueDate, userId, description = '', status = 'Pending', priority = 'Medium') {
        this.title = title;
        this.dueDate = dueDate;
        this.userId = userId;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.completed = false;
    }

    markComplete() {
        this.completed = true;
        this.status = 'Completed';
        return this;
    }

    updateDetails(details = {}) {
        Object.assign(this, details);
        if (details.status === 'Completed' || details.completed === true) {
            this.completed = true;
            this.status = 'Completed';
        } else if (details.completed === false) {
            this.completed = false;
        }
        return this;
    }

    isOverdue() {
        if (this.completed || !this.dueDate) {
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dueDate = new Date(this.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        return dueDate < today;
    }
}

class Booking {
    constructor(userId, date, reason, status = 'Pending') {
        this.userId = userId;
        this.date = date;
        this.reason = reason;
        this.status = status;
    }

    confirm() {
        this.status = 'Confirmed';
        return this;
    }

    complete() {
        this.status = 'Completed';
        return this;
    }

    cancel() {
        this.status = 'Cancelled';
        return this;
    }
}

function calculateProgress(tasks) {
    const completed = tasks.filter((task) => task.completed || task.status === 'Completed').length;
    const total = tasks.length;
    const outstanding = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, outstanding, percentage };
}

module.exports = { User, Task, Booking, calculateProgress };
