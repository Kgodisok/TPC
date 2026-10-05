const express = require('express');
const path = require('path');

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
