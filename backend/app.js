const express = require('express');
const path = require('path');
const { registerUser, loginUser, validateSession } = require('./auth');
const { createTask, listTasks, updateTask, deleteTask, createBooking, listBookings, updateBooking, deleteBooking } = require('./database');

const app = express();
const port = process.env.PORT || 3000;
const rootDir = path.join(__dirname, '..');

app.use(express.json());
app.use(express.static(rootDir));

app.get('/', (req, res) => {
    res.sendFile(path.join(rootDir, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(rootDir, 'public', 'login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(rootDir, 'public', 'dashboard.html'));
});

app.get('/api/health', (req, res) => {
    res.json({ ok: true, app: 'SkillsTrack', status: 'healthy' });
});

app.post('/api/auth/register', (req, res) => {
    try {
        const { displayName, email, password } = req.body || {};
        const user = registerUser({ displayName, email, password });
        res.status(201).json({ message: 'User registered successfully.', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body || {};
        const session = loginUser({ email, password });
        res.status(200).json({ message: 'Login successful.', session });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

app.get('/api/auth/validate/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const valid = validateSession(sessionId);
    res.status(200).json({ valid });
});

app.get('/api/tasks', (req, res) => {
    const tasks = listTasks();
    res.status(200).json({ tasks });
});

app.post('/api/tasks', (req, res) => {
    try {
        const task = createTask(req.body || {});
        res.status(201).json({ message: 'Task created.', task });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/tasks/:taskId', (req, res) => {
    const task = updateTask(req.params.taskId, req.body || {});
    if (!task) {
        return res.status(404).json({ error: 'Task not found.' });
    }

    return res.status(200).json({ message: 'Task updated.', task });
});

app.delete('/api/tasks/:taskId', (req, res) => {
    const removed = deleteTask(req.params.taskId);
    if (!removed) {
        return res.status(404).json({ error: 'Task not found.' });
    }

    return res.status(200).json({ message: 'Task deleted.' });
});

app.get('/api/bookings', (req, res) => {
    res.status(200).json({ bookings: listBookings() });
});

app.post('/api/bookings', (req, res) => {
    try {
        const booking = createBooking(req.body || {});
        res.status(201).json({ message: 'Booking created.', booking });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/bookings/:bookingId', (req, res) => {
    const booking = updateBooking(req.params.bookingId, req.body || {});
    if (!booking) {
        return res.status(404).json({ error: 'Booking not found.' });
    }

    return res.status(200).json({ message: 'Booking updated.', booking });
});

app.delete('/api/bookings/:bookingId', (req, res) => {
    const removed = deleteBooking(req.params.bookingId);
    if (!removed) {
        return res.status(404).json({ error: 'Booking not found.' });
    }

    return res.status(200).json({ message: 'Booking deleted.' });
});

app.use((req, res) => {
    res.status(404).send('Page not found');
});

let server;

if (require.main === module) {
    server = app.listen(port, () => {
        console.log(`SkillsTrack is running at http://localhost:${port}`);
    });
}

module.exports = { app, server };
