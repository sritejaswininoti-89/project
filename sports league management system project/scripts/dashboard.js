document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Display username
    document.getElementById('usernameDisplay').textContent = currentUser.email.split('@')[0];

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });

    // Modal functionality
    const modals = {
        teamModal: document.getElementById('teamModal'),
        playerModal: document.getElementById('playerModal'),
        matchModal: document.getElementById('matchModal')
    };

    const openModalButtons = {
        addTeamBtn: document.getElementById('addTeamBtn'),
        addPlayerBtn: document.getElementById('addPlayerBtn'),
        addMatchBtn: document.getElementById('addMatchBtn')
    };

    // Open modals
    Object.keys(openModalButtons).forEach(buttonId => {
        const modalId = buttonId.replace('add', '').replace('Btn', 'Modal');
        openModalButtons[buttonId].addEventListener('click', () => {
            modals[modalId].style.display = 'block';
        });
    });

    // Close modals
    document.querySelectorAll('.close-btn').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        Object.values(modals).forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Initialize data and UI
    loadData();
    updateStats();
    populateTeamsDropdowns();

    // Form submissions
    document.getElementById('teamForm').addEventListener('submit', handleTeamSubmit);
    document.getElementById('playerForm').addEventListener('submit', handlePlayerSubmit);
    document.getElementById('matchForm').addEventListener('submit', handleMatchSubmit);
});

function loadData() {
    const data = JSON.parse(localStorage.getItem('sportsLeagueData')) || {
        teams: [],
        players: [],
        matches: []
    };

    // Populate teams table
    const teamsTable = document.getElementById('teamsTable').querySelector('tbody');
    teamsTable.innerHTML = '';
    data.teams.forEach(team => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${team.name}</td>
            <td>${team.sport}</td>
            <td>${data.players.filter(p => p.team === team.name).length}</td>
            <td>${data.matches.filter(m => m.team1 === team.name || m.team2 === team.name).length}</td>
            <td>
                <button class="action-btn edit" data-id="${team.id}">✏️</button>
                <button class="action-btn delete" data-id="${team.id}">🗑️</button>
            </td>
        `;
        teamsTable.appendChild(row);
    });

    // Populate players table
    const playersTable = document.getElementById('playersTable').querySelector('tbody');
    playersTable.innerHTML = '';
    data.players.forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.name}</td>
            <td>${player.team}</td>
            <td>${player.position}</td>
            <td>${player.age}</td>
            <td>0 Goals</td>
            <td>
                <button class="action-btn edit" data-id="${player.id}">✏️</button>
                <button class="action-btn delete" data-id="${player.id}">🗑️</button>
            </td>
        `;
        playersTable.appendChild(row);
    });

    // Populate matches grid
    const matchesGrid = document.querySelector('.matches-grid');
    matchesGrid.innerHTML = '';
    data.matches.forEach(match => {
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
        matchCard.innerHTML = `
            <div class="match-teams">
                <div class="team">
                    <div class="team-logo">${match.team1.charAt(0)}</div>
                    <div class="team-name">${match.team1}</div>
                </div>
                <div class="vs">VS</div>
                <div class="team">
                    <div class="team-logo">${match.team2.charAt(0)}</div>
                    <div class="team-name">${match.team2}</div>
                </div>
            </div>
            <div class="match-info">
                <p><i class="fas fa-calendar-alt"></i> ${new Date(match.date).toLocaleString()}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${match.location}</p>
            </div>
        `;
        matchesGrid.appendChild(matchCard);
    });

    // Add event listeners to action buttons
    document.querySelectorAll('.action-btn.delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const type = this.closest('table') ? 
                (this.closest('table').id === 'teamsTable' ? 'teams' : 'players') : 
                'matches';
            deleteItem(id, type);
        });
    });
}

function updateStats() {
    const data = JSON.parse(localStorage.getItem('sportsLeagueData')) || {
        teams: [],
        players: [],
        matches: []
    };

    document.getElementById('teamsCount').textContent = data.teams.length;
    document.getElementById('playersCount').textContent = data.players.length;
    document.getElementById('matchesCount').textContent = data.matches.length;
    document.getElementById('upcomingCount').textContent = data.matches.filter(match => 
        new Date(match.date) > new Date()
    ).length;
}

function populateTeamsDropdowns() {
    const data = JSON.parse(localStorage.getItem('sportsLeagueData')) || { teams: [] };
    const dropdowns = [
        document.getElementById('playerTeam'),
        document.getElementById('matchTeam1'),
        document.getElementById('matchTeam2')
    ];

    dropdowns.forEach(dropdown => {
        dropdown.innerHTML = '<option value="">Select Team</option>';
        data.teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.name;
            option.textContent = team.name;
            dropdown.appendChild(option);
        });
    });
}

function handleTeamSubmit(e) {
    e.preventDefault();
    const data = JSON.parse(localStorage.getItem('sportsLeagueData')) || {
        teams: [],
        players: [],
        matches: []
    };

    const newTeam = {
        id: Date.now().toString(),
        name: document.getElementById('teamName').value,
        sport: document.getElementById('teamSport').value,
        logo: document.getElementById('teamLogo').value || null
    };

    data.teams.push(newTeam);
    localStorage.setItem('sportsLeagueData', JSON.stringify(data));

    document.getElementById('teamModal').style.display = 'none';
    document.getElementById('teamForm').reset();
    loadData();
    updateStats();
    populateTeamsDropdowns();
}

function handlePlayerSubmit(e) {
    e.preventDefault();
    const data = JSON.parse(localStorage.getItem('sportsLeagueData')) || {
        teams: [],
        players: [],
        matches: []
    };

    const newPlayer = {
        id: Date.now().toString(),
        name: document.getElementById('playerName').value,
        team: document.getElementById('playerTeam').value,
        position: document.getElementById('playerPosition').value,
        age: document.getElementById('playerAge').value
    };

    data.players.push(newPlayer);
    localStorage.setItem('sportsLeagueData', JSON.stringify(data));

    document.getElementById('playerModal').style.display = 'none';
    document.getElementById('playerForm').reset();
    loadData();
    updateStats();
}

function handleMatchSubmit(e) {
    e.preventDefault();
    const data = JSON.parse(localStorage.getItem('sportsLeagueData')) || {
        teams: [],
        players: [],
        matches: []
    };

    const team1 = document.getElementById('matchTeam1').value;
    const team2 = document.getElementById('matchTeam2').value;

    if (team1 === team2) {
        alert('A team cannot play against itself!');
        return;
    }

    const newMatch = {
        id: Date.now().toString(),
        team1,
        team2,
        date: document.getElementById('matchDate').value,
        location: document.getElementById('matchLocation').value
    };

    data.matches.push(newMatch);
    localStorage.setItem('sportsLeagueData', JSON.stringify(data));

    document.getElementById('matchModal').style.display = 'none';
    document.getElementById('matchForm').reset();
    loadData();
    updateStats();
}

function deleteItem(id, type) {
    if (!confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) return;

    const data = JSON.parse(localStorage.getItem('sportsLeagueData')) || {
        teams: [],
        players: [],
        matches: []
    };

    if (type === 'teams') {
        // Also delete players and matches associated with this team
        const teamName = data.teams.find(t => t.id === id)?.name;
        if (teamName) {
            data.players = data.players.filter(p => p.team !== teamName);
            data.matches = data.matches.filter(m => m.team1 !== teamName && m.team2 !== teamName);
        }
    } else if (type === 'players') {
        // Just delete the player
        data.players = data.players.filter(p => p.id !== id);
    } else if (type === 'matches') {
        // Just delete the match
        data.matches = data.matches.filter(m => m.id !== id);
    }

    data[type] = data[type].filter(item => item.id !== id);
    localStorage.setItem('sportsLeagueData', JSON.stringify(data));

    loadData();
    updateStats();
}