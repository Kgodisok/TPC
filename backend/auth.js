const crypto = require('node:crypto');

const users = new Map();
const sessions = new Map();

function hashPassword(password) {
    return crypto.createHash('sha256').update(String(password)).digest('hex');
}

function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function validatePassword(password) {
    if (typeof password !== 'string') {
        return false;
    }

    return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
}

function registerUser({ displayName, email, password }) {
    const normalizedEmail = normalizeEmail(email);
    const name = typeof displayName === 'string' ? displayName.trim() : '';

    if (!name) {
        throw new Error('Display name is required.');
    }

    if (/\d/.test(name)) {
        throw new Error('Display name must not contain numbers.');
    }

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
        throw new Error('A valid email address is required.');
    }

    if (!validatePassword(password)) {
        throw new Error('Password must be at least 8 characters and contain a capital letter and a number.');
    }

    if (users.has(normalizedEmail)) {
        throw new Error('An account with this email already exists.');
    }

    const user = {
        id: `user-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        displayName: name,
        email: normalizedEmail,
        passwordHash: hashPassword(password)
    };

    users.set(normalizedEmail, user);
    return { ...user, password: undefined };
}

function loginUser({ email, password }) {
    const normalizedEmail = normalizeEmail(email);
    const user = users.get(normalizedEmail);

    if (!user) {
        throw new Error('User not found.');
    }

    if (user.passwordHash !== hashPassword(password)) {
        throw new Error('Incorrect password.');
    }

    const sessionId = `session-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    const session = {
        sessionId,
        userId: user.id,
        email: user.email,
        displayName: user.displayName
    };

    sessions.set(sessionId, session);
    return session;
}

function validateSession(sessionId) {
    return sessions.has(sessionId);
}

function logoutUser(sessionId) {
    if (!sessionId) {
        return false;
    }

    return sessions.delete(sessionId);
}

module.exports = {
    users,
    sessions,
    hashPassword,
    normalizeEmail,
    validatePassword,
    registerUser,
    loginUser,
    validateSession,
    logoutUser
};
