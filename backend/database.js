const { randomUUID } = require('node:crypto');

const taskStore = [];
const bookingStore = [];

function sanitizeText(value, fallback = '') {
    if (value === null || value === undefined) {
        return fallback;
    }

    return String(value).trim() || fallback;
}

function normalizeStatus(status, fallback = 'Pending') {
    const normalized = String(status || fallback).trim();
    const options = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
    return options.includes(normalized) ? normalized : fallback;
}

function normalizePriority(priority, fallback = 'Medium') {
    const normalized = String(priority || fallback).trim().toLowerCase();
    const options = {
        low: 'Low',
        medium: 'Medium',
        high: 'High'
    };
    return options[normalized] || fallback;
}

function normalizeTask(input = {}) {
    const title = sanitizeText(input.title, 'Untitled task');
    const userId = sanitizeText(input.userId, 'guest-user');
    const status = normalizeStatus(input.status, 'Pending');
    const priority = normalizePriority(input.priority, 'Medium');
    const dueDate = sanitizeText(input.dueDate, new Date().toISOString().slice(0, 10));
    const description = sanitizeText(input.description, '');

    const completed = input.completed === true || status === 'Completed';

    return {
        id: sanitizeText(input.id, randomUUID()),
        userId,
        title,
        description,
        dueDate,
        status,
        priority,
        completed
    };
}

function createTask(taskInput = {}) {
    const task = normalizeTask(taskInput);
    taskStore.push(task);
    return { ...task };
}

function listTasks() {
    return taskStore.map((task) => ({ ...task }));
}

function getTaskById(taskId) {
    return taskStore.find((task) => task.id === taskId) || null;
}

function updateTask(taskId, updates = {}) {
    const task = getTaskById(taskId);
    if (!task) {
        return null;
    }

    const nextState = normalizeTask({ ...task, ...updates, id: task.id });
    const index = taskStore.findIndex((item) => item.id === taskId);
    taskStore[index] = nextState;
    return { ...nextState };
}

function deleteTask(taskId) {
    const index = taskStore.findIndex((task) => task.id === taskId);
    if (index === -1) {
        return false;
    }

    taskStore.splice(index, 1);
    return true;
}

function normalizeBooking(input = {}) {
    const userId = sanitizeText(input.userId, 'guest-user');
    const date = sanitizeText(input.date, new Date().toISOString().slice(0, 10));
    const reason = sanitizeText(input.reason, 'Support session');
    const status = normalizeStatus(input.status, 'Pending');

    return {
        id: sanitizeText(input.id, randomUUID()),
        userId,
        date,
        reason,
        status
    };
}

function listBookings() {
    return bookingStore.map((booking) => ({ ...booking }));
}

function createBooking(bookingInput = {}) {
    const booking = normalizeBooking(bookingInput);
    bookingStore.push(booking);
    return { ...booking };
}

function updateBooking(bookingId, updates = {}) {
    const booking = bookingStore.find((item) => item.id === bookingId);
    if (!booking) {
        return null;
    }

    const nextState = normalizeBooking({ ...booking, ...updates, id: booking.id });
    const index = bookingStore.findIndex((item) => item.id === bookingId);
    bookingStore[index] = nextState;
    return { ...nextState };
}

function deleteBooking(bookingId) {
    const index = bookingStore.findIndex((booking) => booking.id === bookingId);
    if (index === -1) {
        return false;
    }

    bookingStore.splice(index, 1);
    return true;
}

module.exports = {
    taskStore,
    bookingStore,
    sanitizeText,
    normalizeStatus,
    normalizePriority,
    normalizeTask,
    createTask,
    listTasks,
    getTaskById,
    updateTask,
    deleteTask,
    normalizeBooking,
    listBookings,
    createBooking,
    updateBooking,
    deleteBooking
};
