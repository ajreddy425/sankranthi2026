const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Initialize SQLite Database
const db = new sqlite3.Database('./festival.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    // Create tables sequentially to avoid timing issues
    db.serialize(() => {
        // Page views table
        db.run(`CREATE TABLE IF NOT EXISTS page_views (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            count INTEGER DEFAULT 0,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating page_views table:', err);
            } else {
                console.log('✅ Page views table ready');
                // Initialize page views if not exists - use setTimeout to ensure table is ready
                setTimeout(() => {
                    db.get('SELECT COUNT(*) as count FROM page_views', (err, row) => {
                        if (err) {
                            console.error('Error checking page views:', err);
                        } else if (row.count === 0) {
                            db.run('INSERT INTO page_views (count) VALUES (1)', (err) => {
                                if (err) {
                                    console.error('Error inserting initial page views:', err);
                                } else {
                                    console.log('✅ Page views initialized with 1 - Now counting real visitors!');
                                }
                            });
                        } else {
                            console.log('✅ Page views table already has data');
                        }
                    });
                }, 100);
            }
        });

        // Contact messages table
        db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating contact_messages table:', err);
            } else {
                console.log('✅ Contact messages table ready');
            }
        });

        // Live updates/notifications table
        db.run(`CREATE TABLE IF NOT EXISTS live_updates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title_te TEXT NOT NULL,
            title_en TEXT NOT NULL,
            content_te TEXT NOT NULL,
            content_en TEXT NOT NULL,
            type TEXT DEFAULT 'info',
            is_active BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating live_updates table:', err);
            } else {
                console.log('✅ Live updates table ready');
                // Insert sample updates after table creation
                insertSampleUpdates();
            }
        });

        // Events table
        db.run(`CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name_te TEXT NOT NULL,
            name_en TEXT NOT NULL,
            description_te TEXT,
            description_en TEXT,
            event_date DATE,
            event_time TIME,
            location_te TEXT,
            location_en TEXT,
            is_active BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating events table:', err);
            } else {
                console.log('✅ Events table ready');
                // Insert sample events after table creation
                insertSampleEvents();
            }
        });

        // Game scores table
        db.run(`CREATE TABLE IF NOT EXISTS game_scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            game_name_te TEXT NOT NULL,
            game_name_en TEXT NOT NULL,
            team1_name TEXT NOT NULL,
            team2_name TEXT NOT NULL,
            team1_score INTEGER DEFAULT 0,
            team2_score INTEGER DEFAULT 0,
            status TEXT DEFAULT 'upcoming',
            match_date DATE,
            match_time TIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating game_scores table:', err);
            } else {
                console.log('✅ Game scores table ready');
            }
        });
    });
}

function insertSampleUpdates() {
    const sampleUpdates = [
        {
            title_te: '🆕 కొత్తవి',
            title_en: '🆕 NEW',
            content_te: 'సంక్రాంతి 2026 యొక్క మొదటి పోస్టర్ విడుదల చేయబడింది',
            content_en: 'Sankranthi 2026 first poster is released',
            type: 'announcement'
        },
        {
            title_te: '🏆 ఫలితాలు',
            title_en: '🏆 Results',
            content_te: 'కబడ్డి టోర్నమెంట్ రిజిస్ట్రేషన్ ప్రారంభమైంది',
            content_en: 'Kabaddi tournament registration has started',
            type: 'sports'
        }
    ];

    sampleUpdates.forEach(update => {
        db.get('SELECT COUNT(*) as count FROM live_updates WHERE title_te = ?', [update.title_te], (err, row) => {
            if (err) {
                console.error('Error checking live updates:', err);
            } else if (row.count === 0) {
                db.run(
                    'INSERT INTO live_updates (title_te, title_en, content_te, content_en, type) VALUES (?, ?, ?, ?, ?)',
                    [update.title_te, update.title_en, update.content_te, update.content_en, update.type],
                    (err) => {
                        if (err) {
                            console.error('Error inserting sample update:', err);
                        } else {
                            console.log('✅ Sample update added:', update.title_en);
                        }
                    }
                );
            }
        });
    });
}

function insertSampleEvents() {
    const sampleEvents = [
        {
            name_te: 'భోగి పండుగ',
            name_en: 'Bhogi Festival',
            description_te: 'పాత వస్తువులను తగలబెట్టి కొత్త జీవనాన్ని స్వాగతించే పండుగ',
            description_en: 'Festival of burning old items and welcoming new life',
            event_date: '2026-01-13',
            event_time: '06:00',
            location_te: 'గ్రామ మధ్యలో',
            location_en: 'Village Center'
        },
        {
            name_te: 'మకర సంక్రాంతి',
            name_en: 'Makar Sankranthi',
            description_te: 'పతంగాలు ఎగరవేయడం మరియు తిల్లి మిఠాయిలు పంచుకోవడం',
            description_en: 'Flying kites and sharing sesame sweets',
            event_date: '2026-01-14',
            event_time: '05:30',
            location_te: 'గ్రామం అంతటా',
            location_en: 'Throughout the village'
        },
        {
            name_te: 'కనుమ పండుగ',
            name_en: 'Kanuma Festival',
            description_te: 'పశువులను పూజించి వారికి గౌరవం ఇవ్వే పండుగ',
            description_en: 'Festival of worshipping and honoring cattle',
            event_date: '2026-01-15',
            event_time: '07:00',
            location_te: 'గ్రామ పశువుల దగ్గర',
            location_en: 'Village cattle area'
        }
    ];

    sampleEvents.forEach(event => {
        db.get('SELECT COUNT(*) as count FROM events WHERE name_te = ?', [event.name_te], (err, row) => {
            if (err) {
                console.error('Error checking events:', err);
            } else if (row.count === 0) {
                db.run(
                    'INSERT INTO events (name_te, name_en, description_te, description_en, event_date, event_time, location_te, location_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [event.name_te, event.name_en, event.description_te, event.description_en, event.event_date, event.event_time, event.location_te, event.location_en],
                    (err) => {
                        if (err) {
                            console.error('Error inserting sample event:', err);
                        } else {
                            console.log('✅ Sample event added:', event.name_en);
                        }
                    }
                );
            }
        });
    });
}

// Routes

// Serve main page and increment page views
app.get('/', (req, res) => {
    // Increment page views for every visit
    db.run('UPDATE page_views SET count = count + 1, last_updated = CURRENT_TIMESTAMP', (err) => {
        if (err) {
            console.error('Error updating page views:', err);
        } else {
            // Log the new count
            db.get('SELECT count FROM page_views ORDER BY id DESC LIMIT 1', (err, row) => {
                if (!err && row) {
                    console.log(`📈 New visitor! Total views: ${row.count}`);
                }
            });
        }
    });
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API Routes

// Get page views
app.get('/api/page-views', (req, res) => {
    db.get('SELECT count FROM page_views ORDER BY id DESC LIMIT 1', (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ views: row ? row.count : 0 });
        }
    });
});

// Get live updates
app.get('/api/live-updates', (req, res) => {
    db.all('SELECT * FROM live_updates WHERE is_active = 1 ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Add new live update
app.post('/api/live-updates', (req, res) => {
    const { title_te, title_en, content_te, content_en, type } = req.body;
    
    if (!title_te || !title_en || !content_te || !content_en) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.run(
        'INSERT INTO live_updates (title_te, title_en, content_te, content_en, type) VALUES (?, ?, ?, ?, ?)',
        [title_te, title_en, content_te, content_en, type || 'info'],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ id: this.lastID, message: 'Update added successfully' });
            }
        }
    );
});

// Get events
app.get('/api/events', (req, res) => {
    db.all('SELECT * FROM events WHERE is_active = 1 ORDER BY event_date ASC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Add new event
app.post('/api/events', (req, res) => {
    const { name_te, name_en, description_te, description_en, event_date, event_time, location_te, location_en } = req.body;
    
    if (!name_te || !name_en) {
        return res.status(400).json({ error: 'Event names are required in both languages' });
    }

    db.run(
        'INSERT INTO events (name_te, name_en, description_te, description_en, event_date, event_time, location_te, location_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name_te, name_en, description_te, description_en, event_date, event_time, location_te, location_en],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ id: this.lastID, message: 'Event added successfully' });
            }
        }
    );
});

// Get game scores
app.get('/api/game-scores', (req, res) => {
    db.all('SELECT * FROM game_scores ORDER BY match_date DESC, match_time DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Add/Update game scores
app.post('/api/game-scores', (req, res) => {
    const { game_name_te, game_name_en, team1_name, team2_name, team1_score, team2_score, status, match_date, match_time } = req.body;
    
    if (!game_name_te || !game_name_en || !team1_name || !team2_name) {
        return res.status(400).json({ error: 'Game names and team names are required' });
    }

    db.run(
        'INSERT INTO game_scores (game_name_te, game_name_en, team1_name, team2_name, team1_score, team2_score, status, match_date, match_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [game_name_te, game_name_en, team1_name, team2_name, team1_score || 0, team2_score || 0, status || 'upcoming', match_date, match_time],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ id: this.lastID, message: 'Game score added successfully' });
            }
        }
    );
});

// Update game score
app.put('/api/game-scores/:id', (req, res) => {
    const { id } = req.params;
    const { team1_score, team2_score, status } = req.body;
    
    db.run(
        'UPDATE game_scores SET team1_score = ?, team2_score = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [team1_score, team2_score, status, id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ error: 'Game not found' });
            } else {
                res.json({ message: 'Game score updated successfully' });
            }
        }
    );
});

// Submit contact message
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.run(
        'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
        [name, email, message],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ id: this.lastID, message: 'Message sent successfully' });
            }
        }
    );
});

// Get contact messages (admin only)
app.get('/api/contact-messages', (req, res) => {
    db.all('SELECT * FROM contact_messages ORDER BY timestamp DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Database: SQLite (festival.db)`);
    console.log(`🎉 Kalepalle Sankranthi 2026 Backend Ready!`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n📴 Shutting down server...');
    db.close((err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('✅ Database connection closed.');
        }
        process.exit(0);
    });
});