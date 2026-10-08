const crypto = require('node:crypto');

const users = new Map();
const sessions = new Map();

function hashPassword(password) {
    return crypto.createHash('sha256').update(String(password)).digest('hex');
}

function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function normalizeDisplayName(displayName) {
    return typeof displayName === 'string' ? displayName.trim().replace(/\s+/g, ' ') : '';
}

function validateDisplayName(displayName) {
    if (typeof displayName !== 'string' || displayName.length < 2 || displayName.length > 60) {
        return false;
    }

    return /^[\p{L}][\p{L}\p{M}]*(?:[ '\u2019-][\p{L}][\p{L}\p{M}]*)*$/u.test(displayName);
}

function validateEmail(email) {
    if (typeof email !== 'string' || email.length > 254) {
        return false;
    }

    const normalizedEmail = email.trim();
    const parts = normalizedEmail.split('@');
    if (parts.length !== 2) {
        return false;
    }

    const [localPart, domain] = parts;
    if (!localPart || localPart.length > 64 || localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
        return false;
    }

    if (!/^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(localPart)) {
        return false;
    }

    const domainLabels = domain.split('.');
    if (domainLabels.length < 2 || domainLabels.some((label) => (
        label.length > 63 || !/^[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?$/i.test(label)
    ))) {
        return false;
    }

    return /^[A-Z]{2,63}$/i.test(domainLabels.at(-1)) || /^xn--[A-Z0-9-]{2,59}$/i.test(domainLabels.at(-1));
}

function validatePassword(password) {
    if (typeof password !== 'string') {
        return false;
    }

    return password.length >= 8
        && password.length <= 128
        && /[A-Z]/.test(password)
        && /[a-z]/.test(password)
        && /\d/.test(password)
        && /[^A-Za-z0-9\s]/.test(password);
}

function registerUser({ displayName, email, password }) {
    const normalizedEmail = normalizeEmail(email);
    const name = normalizeDisplayName(displayName);

    if (!name) {
        throw new Error('Display name is required.');
    }

    if (/\d/.test(name)) {
        throw new Error('Display name must not contain numbers.');
    }

    if (!validateDisplayName(name)) {
        throw new Error('Display name must be 2-60 characters and contain only letters, spaces, apostrophes, or hyphens.');
    }

    if (!validateEmail(normalizedEmail)) {
        throw new Error('A valid email address is required.');
    }

    if (!validatePassword(password)) {
        throw new Error('Password must be 8-128 characters and contain uppercase and lowercase letters, a number, and a symbol.');
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
    normalizeDisplayName,
    validateDisplayName,
    validateEmail,
    validatePassword,
    registerUser,
    loginUser,
    validateSession,
    logoutUser
};
