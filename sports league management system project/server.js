const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'db.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
    fs.mkdirSync(path.dirname(DATA_FILE));
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({
        users: [],
        teams: [],
        players: [],
        matches: []
    }));
}

// Helper function to read data
function readData() {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

// Helper function to write data
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Authentication endpoints
app.post('/api/signup', (req, res) => {
    const { email, password } = req.body;
    const data = readData();

    // Check if user already exists
    if (data.users.some(user => user.email === email)) {
        return res.status(400).json({ error: 'User already exists' });
    }

    // Add new user
    data.users.push({ email, password });
    writeData(data);

    res.json({ success: true, message: 'Account created successfully' });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const data = readData();

    // Find user
    const user = data.users.find(user => user.email === email && user.password === password);

    if (user) {
        res.json({ success: true, email });
    } else {
        res.status(401).json({ error: 'Invalid email or password' });
    }
});

// Data endpoints
app.get('/api/teams', (req, res) => {
    const data = readData();
    res.json(data.teams);
});

app.post('/api/teams', (req, res) => {
    const team = req.body;
    const data = readData();

    team.id = Date.now().toString();
    data.teams.push(team);
    writeData(data);

    res.json(team);
});

app.delete('/api/teams/:id', (req, res) => {
    const { id } = req.params;
    const data = readData();

    // Also delete related players and matches
    const teamName = data.teams.find(t => t.id === id)?.name;
    if (teamName) {
        data.players = data.players.filter(p => p.team !== teamName);
        data.matches = data.matches.filter(m => m.team1 !== teamName && m.team2 !== teamName);
    }

    data.teams = data.teams.filter(team => team.id !== id);
    writeData(data);

    res.json({ success: true });
});

app.get('/api/players', (req, res) => {
    const data = readData();
    res.json(data.players);
});

app.post('/api/players', (req, res) => {
    const player = req.body;
    const data = readData();

    player.id = Date.now().toString();
    data.players.push(player);
    writeData(data);

    res.json(player);
});

app.delete('/api/players/:id', (req, res) => {
    const { id } = req.params;
    const data = readData();

    data.players = data.players.filter(player => player.id !== id);
    writeData(data);

    res.json({ success: true });
});

app.get('/api/matches', (req, res) => {
    const data = readData();
    res.json(data.matches);
});

app.post('/api/matches', (req, res) => {
    const match = req.body;
    const data = readData();

    if (match.team1 === match.team2) {
        return res.status(400).json({ error: 'A team cannot play against itself' });
    }

    match.id = Date.now().toString();
    data.matches.push(match);
    writeData(data);

    res.json(match);
});

app.delete('/api/matches/:id', (req, res) => {
    const { id } = req.params;
    const data = readData();

    data.matches = data.matches.filter(match => match.id !== id);
    writeData(data);

    res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});