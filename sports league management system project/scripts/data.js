// This is included in dashboard.js as we're using localStorage
// For a more robust solution, we would make API calls to the backend

// Sample initial data structure
const initialData = {
    teams: [
        {
            id: "1",
            name: "Red Dragons",
            sport: "Football",
            logo: null
        },
        {
            id: "2",
            name: "Blue Sharks",
            sport: "Basketball",
            logo: null
        }
    ],
    players: [
        {
            id: "1",
            name: "John Smith",
            team: "Red Dragons",
            position: "Forward",
            age: 25
        },
        {
            id: "2",
            name: "Mike Johnson",
            team: "Blue Sharks",
            position: "Guard",
            age: 23
        }
    ],
    matches: [
        {
            id: "1",
            team1: "Red Dragons",
            team2: "Blue Sharks",
            date: "2023-12-15T19:00",
            location: "City Stadium"
        }
    ]
};

// Initialize data if not exists
if (!localStorage.getItem('sportsLeagueData')) {
    localStorage.setItem('sportsLeagueData', JSON.stringify(initialData));
}