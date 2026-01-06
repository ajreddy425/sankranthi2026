// Admin Panel JavaScript

// Base API URL
const API_BASE = '';

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
    loadUpdates();
    loadEvents();
    loadScores();
    loadMessages();
    
    // Set up form handlers
    setupForms();
});

// Tab switching
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

// Load dashboard statistics
async function loadDashboard() {
    try {
        // Load page views
        const viewsResponse = await fetch(`${API_BASE}/api/page-views`);
        const viewsData = await viewsResponse.json();
        document.getElementById('page-views').textContent = viewsData.views.toLocaleString();
        
        // Load events count
        const eventsResponse = await fetch(`${API_BASE}/api/events`);
        const eventsData = await eventsResponse.json();
        document.getElementById('event-count').textContent = eventsData.length;
        
        // Load games count
        const scoresResponse = await fetch(`${API_BASE}/api/game-scores`);
        const scoresData = await scoresResponse.json();
        document.getElementById('game-count').textContent = scoresData.length;
        
        // Load messages count
        const messagesResponse = await fetch(`${API_BASE}/api/contact-messages`);
        const messagesData = await messagesResponse.json();
        document.getElementById('message-count').textContent = messagesData.length;
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Load live updates
async function loadUpdates() {
    try {
        const response = await fetch(`${API_BASE}/api/live-updates`);
        const updates = await response.json();
        
        const updatesList = document.getElementById('updates-list');
        updatesList.innerHTML = '';
        
        updates.forEach(update => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${update.title_te}</td>
                <td>${update.title_en}</td>
                <td><span class="badge badge-${update.type}">${update.type}</span></td>
                <td>${new Date(update.created_at).toLocaleString()}</td>
            `;
            updatesList.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading updates:', error);
    }
}

// Load events
async function loadEvents() {
    try {
        const response = await fetch(`${API_BASE}/api/events`);
        const events = await response.json();
        
        const eventsList = document.getElementById('events-list');
        eventsList.innerHTML = '';
        
        events.forEach(event => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${event.name_te}</td>
                <td>${event.name_en}</td>
                <td>${event.event_date || 'N/A'}</td>
                <td>${event.event_time || 'N/A'}</td>
                <td>${event.location_en || 'N/A'}</td>
            `;
            eventsList.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

// Load game scores
async function loadScores() {
    try {
        const response = await fetch(`${API_BASE}/api/game-scores`);
        const scores = await response.json();
        
        const scoresList = document.getElementById('scores-list');
        scoresList.innerHTML = '';
        
        scores.forEach(score => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${score.game_name_en}</td>
                <td>${score.team1_name} vs ${score.team2_name}</td>
                <td>${score.team1_score} - ${score.team2_score}</td>
                <td><span class="badge badge-${score.status}">${score.status}</span></td>
                <td>${score.match_date || 'TBD'}</td>
            `;
            scoresList.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading scores:', error);
    }
}

// Load contact messages
async function loadMessages() {
    try {
        const response = await fetch(`${API_BASE}/api/contact-messages`);
        const messages = await response.json();
        
        const messagesList = document.getElementById('messages-list');
        messagesList.innerHTML = '';
        
        messages.forEach(message => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${message.name}</td>
                <td>${message.email}</td>
                <td>${message.message.substring(0, 100)}${message.message.length > 100 ? '...' : ''}</td>
                <td>${new Date(message.timestamp).toLocaleString()}</td>
            `;
            messagesList.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// Setup form handlers
function setupForms() {
    // Live Updates Form
    document.getElementById('update-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            title_te: document.getElementById('title-te').value,
            title_en: document.getElementById('title-en').value,
            content_te: document.getElementById('content-te').value,
            content_en: document.getElementById('content-en').value,
            type: document.getElementById('update-type').value
        };
        
        try {
            const response = await fetch(`${API_BASE}/api/live-updates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showMessage('update-message', 'Update added successfully!', 'success');
                document.getElementById('update-form').reset();
                loadUpdates();
                loadDashboard();
            } else {
                showMessage('update-message', result.error || 'Error adding update', 'error');
            }
        } catch (error) {
            showMessage('update-message', 'Error adding update: ' + error.message, 'error');
        }
    });
    
    // Events Form
    document.getElementById('event-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            name_te: document.getElementById('event-name-te').value,
            name_en: document.getElementById('event-name-en').value,
            description_te: document.getElementById('event-desc-te').value,
            description_en: document.getElementById('event-desc-en').value,
            event_date: document.getElementById('event-date').value,
            event_time: document.getElementById('event-time').value,
            location_te: document.getElementById('event-loc-te').value,
            location_en: document.getElementById('event-loc-en').value
        };
        
        try {
            const response = await fetch(`${API_BASE}/api/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showMessage('event-message', 'Event added successfully!', 'success');
                document.getElementById('event-form').reset();
                loadEvents();
                loadDashboard();
            } else {
                showMessage('event-message', result.error || 'Error adding event', 'error');
            }
        } catch (error) {
            showMessage('event-message', 'Error adding event: ' + error.message, 'error');
        }
    });
    
    // Game Scores Form
    document.getElementById('score-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            game_name_te: document.getElementById('game-name-te').value,
            game_name_en: document.getElementById('game-name-en').value,
            team1_name: document.getElementById('team1-name').value,
            team2_name: document.getElementById('team2-name').value,
            team1_score: parseInt(document.getElementById('team1-score').value) || 0,
            team2_score: parseInt(document.getElementById('team2-score').value) || 0,
            status: document.getElementById('game-status').value,
            match_date: document.getElementById('match-date').value,
            match_time: document.getElementById('match-time').value
        };
        
        try {
            const response = await fetch(`${API_BASE}/api/game-scores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showMessage('score-message', 'Game score added successfully!', 'success');
                document.getElementById('score-form').reset();
                loadScores();
                loadDashboard();
            } else {
                showMessage('score-message', result.error || 'Error adding game score', 'error');
            }
        } catch (error) {
            showMessage('score-message', 'Error adding game score: ' + error.message, 'error');
        }
    });
}

// Show message helper
function showMessage(containerId, message, type) {
    const container = document.getElementById(containerId);
    const messageClass = type === 'success' ? 'success-message' : 'error-message';
    
    container.innerHTML = `<div class="${messageClass}">${message}</div>`;
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

// Refresh data every 30 seconds
setInterval(() => {
    loadDashboard();
    if (document.getElementById('updates').classList.contains('active')) {
        loadUpdates();
    }
    if (document.getElementById('scores').classList.contains('active')) {
        loadScores();
    }
}, 30000);