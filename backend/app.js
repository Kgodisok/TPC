/*const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;


app.use((req, res, next) => {
	const now = new Date().toISOString();
	console.log(`[${now}] ${req.method} ${req.url}`);
	next();
});


app.use(express.static(path.join(__dirname, '..', 'public')));


app.get('/', (req, res) => {
	res.redirect('/login.html');
});

app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});

*/