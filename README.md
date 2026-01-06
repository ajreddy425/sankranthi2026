# Kalepalle Sankranthi Festival 2026 - Dynamic Website

## 🎉 Overview
A beautiful, dynamic website for Kalepalle Sankranthi Festival 2026 with real-time updates, event management, and live game scores.

## 🚀 Features
- **Dynamic Page Views Counter**: Track website visitors in real-time
- **Live Updates**: Real-time notifications and announcements
- **Event Management**: Add and manage festival events
- **Game Scores**: Live sports scores and results
- **Contact System**: Database-stored contact messages
- **Admin Panel**: Full management interface
- **Bilingual Support**: Telugu and English
- **Free Database**: Uses SQLite (no cloud setup required)

## 📁 Project Structure
```
kalepalle-san-2026/
├── index.html          # Main website
├── admin.html          # Admin management panel
├── script.js           # Frontend JavaScript
├── admin.js           # Admin panel JavaScript
├── style.css          # Website styling
├── server.js          # Backend server (Node.js)
├── package.json       # Dependencies
├── festival.db        # SQLite database (auto-created)
├── setup.bat          # Windows setup script
└── images/            # Image assets
```

## 🛠️ Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (Download and install)

### Quick Setup (Windows)
1. Run `setup.bat` - This will install all dependencies automatically
2. Run `npm start` to start the server
3. Open http://localhost:3000 in your browser

### Manual Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Access the website: http://localhost:3000

## 🎯 Access Points
- **Main Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin.html

## 💾 Database (FREE - No Cloud Required!)
- **Type**: SQLite (Local file-based database)
- **File**: `festival.db` (automatically created)
- **Cost**: FREE - No cloud services needed
- **Features**: 
  - Page views tracking
  - Contact messages
  - Live updates/notifications
  - Events management
  - Game scores

## 📊 Admin Features
The admin panel allows you to:
- View website statistics (page views, events, messages)
- Add/manage live updates and notifications
- Create and manage festival events
- Update game scores in real-time
- View contact form submissions

## 🔧 API Endpoints
- `GET /api/page-views` - Get total page views
- `GET /api/live-updates` - Get live notifications
- `POST /api/live-updates` - Add new notification
- `GET /api/events` - Get all events
- `POST /api/events` - Add new event
- `GET /api/game-scores` - Get game scores
- `POST /api/game-scores` - Add/update game scores
- `POST /api/contact` - Submit contact message
- `GET /api/contact-messages` - Get all messages (admin)

## 🌐 Language Support
- Telugu (తెలుగు) - Primary language
- English - Secondary language
- Dynamic language switching

## 📱 Responsive Design
Works perfectly on:
- Desktop computers
- Tablets
- Mobile phones

## 🎨 Features Included
- Beautiful festive theme
- Animated notifications
- Real-time score updates
- Mobile-responsive design
- Professional admin interface
- Automatic data refresh every 30 seconds

## ✨ Why This Solution?
1. **FREE Database**: SQLite requires no cloud setup or monthly fees
2. **Easy Setup**: One-command installation
3. **No External Dependencies**: Everything runs locally
4. **Scalable**: Can easily move to cloud databases later
5. **Secure**: Local data storage
6. **Fast**: No network latency for database operations

## 🚀 Deployment Options
### For Production:
1. **Heroku** (Free tier available)
2. **Netlify** + **Railway** for database
3. **Vercel** + **PlanetScale** (free tier)
4. **Local Server** (keep it running on a local machine)

## 👨‍💻 Support
If you need help:
1. Check that Node.js is installed
2. Make sure all files are in the same folder
3. Run `npm install` if dependencies are missing
4. Check the console for any error messages

## 🎊 Ready to Celebrate!
Your Kalepalle Sankranthi Festival 2026 website is now ready with full dynamic functionality!

---
*Made with ❤️ for Kalepalle Community*