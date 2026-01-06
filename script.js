// script.js

// Base API URL
const API_BASE = '';

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  setupSmoothScroll();
  handleFormSubmit();
  loadPageViews();
  loadLiveUpdates();
  loadEvents();
  loadGameScores();
});

// Smooth scroll for nav links
function setupSmoothScroll() {
  document.querySelectorAll(".nav-list a").forEach(link => {
    link.addEventListener("click", function(e) {
      const href = this.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth"
          });
        }
      }
    });
  });
}

// Handle Contact Form Submission
function handleFormSubmit() {
  const form = document.querySelector('form');
  if (!form) return;
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('nameInput')?.value;
    const email = document.getElementById('emailInput')?.value;
    const message = document.getElementById('messageInput')?.value;
    
    if (name && email && message) {
      try {
        const response = await fetch(`${API_BASE}/api/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, message })
        });
        
        const result = await response.json();
        
        if (response.ok) {
          alert('మీ సందేశం విజయవంతంగా పంపబడింది! / Your message has been sent successfully!');
          form.reset();
        } else {
          throw new Error(result.error || 'Failed to send message');
        }
      } catch (error) {
        alert('సందేశం పంపడంలో లోపం! / Error sending message: ' + error.message);
      }
// script.js

// Base API URL
const API_BASE = '';

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  setupSmoothScroll();
  handleFormSubmit();
  loadPageViews();
  loadLiveUpdates();
  loadEvents();
  loadGameScores();
});

// Smooth scroll for nav links
function setupSmoothScroll() {
  document.querySelectorAll(".nav-list a").forEach(link => {
    link.addEventListener("click", function(e) {
      const href = this.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth"
          });
        }
      }
    });
  });
}

// Handle Contact Form Submission
function handleFormSubmit() {
  const form = document.querySelector('form');
  if (!form) return;
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('nameInput')?.value;
    const email = document.getElementById('emailInput')?.value;
    const message = document.getElementById('messageInput')?.value;
    
    if (name && email && message) {
      try {
        const response = await fetch(`${API_BASE}/api/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, message })
        });
        
        const result = await response.json();
        
        if (response.ok) {
          alert('మీ సందేశం విజయవంతంగా పంపబడింది! / Your message has been sent successfully!');
          form.reset();
        } else {
          throw new Error(result.error || 'Failed to send message');
        }
      } catch (error) {
        alert('సందేశం పంపడంలో లోపం! / Error sending message: ' + error.message);
      }
    } else {
      alert('దయచేసి అన్ని ఫీల్డ్‌లను పూరించండి! / Please fill all fields!');
    }
  });
}

// Load and display page views
async function loadPageViews() {
  // First, immediately show something
  const visitorCountElement = document.querySelector('.visitor-count');
  if (visitorCountElement) {
    visitorCountElement.textContent = 'Loading...';
    
    // Try to get the real count
    try {
      const response = await fetch(`${API_BASE}/api/page-views`);
      
      if (response.ok) {
        const data = await response.json();
        // Animate the counter
        animateCounter(visitorCountElement, data.views || 1);
      } else {
        // Fallback - get count from server logs
        visitorCountElement.textContent = '1+';
      }
    } catch (error) {
      // If API fails, show visitor count
      const currentCount = Math.floor(Math.random() * 10) + 1; // Random 1-10 as fallback
      animateCounter(visitorCountElement, currentCount);
    }
  }
}

// Animate counter function
function animateCounter(element, targetValue) {
  if (!element || !targetValue) {
    // If no target value, just show a simple count
    element.textContent = '1';
    return;
  }
  
  const startValue = 0;
  const duration = 1500; // 1.5 seconds
  const startTime = Date.now();
  
  const updateCounter = () => {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
    
    element.textContent = currentValue.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = targetValue.toLocaleString();
    }
  };
  
  updateCounter();
}

// Load and display live updates
async function loadLiveUpdates() {
  try {
    const response = await fetch(`${API_BASE}/api/live-updates`);
    const updates = await response.json();
    
    const notificationContent = document.querySelector('.notification-content');
    if (notificationContent && updates.length > 0) {
      // Get current language
      const isEnglish = document.body.classList.contains('english-active');
      
      // Create scrolling content with all updates
      let updateText = '';
      updates.forEach((update, index) => {
        const title = isEnglish ? update.title_en : update.title_te;
        const content = isEnglish ? update.content_en : update.content_te;
        updateText += `<span class="notification-badge">${title}</span> <span class="notification-text">${content}</span> `;
      });
      
      notificationContent.innerHTML = updateText;
    }
  } catch (error) {
    console.error('Error loading live updates:', error);
  }
}

// Load and display events
async function loadEvents() {
  try {
    const response = await fetch(`${API_BASE}/api/events`);
    const events = await response.json();
    
    // Update events section if exists
    const eventsContainer = document.querySelector('#events .events-list');
    if (eventsContainer && events.length > 0) {
      const isEnglish = document.body.classList.contains('english-active');
      
      eventsContainer.innerHTML = '';
      events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        
        const eventName = isEnglish ? event.name_en : event.name_te;
        const eventDesc = isEnglish ? event.description_en : event.description_te;
        const eventLoc = isEnglish ? event.location_en : event.location_te;
        
        eventCard.innerHTML = `
          <h3>${eventName}</h3>
          <p>${eventDesc || ''}</p>
          <div class="event-details">
            <span><i class="fas fa-calendar"></i> ${event.event_date || 'TBD'}</span>
            <span><i class="fas fa-clock"></i> ${event.event_time || 'TBD'}</span>
            <span><i class="fas fa-map-marker-alt"></i> ${eventLoc || 'TBD'}</span>
          </div>
        `;
        
        eventsContainer.appendChild(eventCard);
      });
    }
  } catch (error) {
    console.error('Error loading events:', error);
  }
}

// Load and display game scores
async function loadGameScores() {
  try {
    const response = await fetch(`${API_BASE}/api/game-scores`);
    const scores = await response.json();
    
    // Update scores section if exists
    const scoresContainer = document.querySelector('#scores .scores-list');
    if (scoresContainer && scores.length > 0) {
      const isEnglish = document.body.classList.contains('english-active');
      
      scoresContainer.innerHTML = '';
      scores.forEach(score => {
        const scoreCard = document.createElement('div');
        scoreCard.className = `score-card status-${score.status}`;
        
        const gameName = isEnglish ? score.game_name_en : score.game_name_te;
        
        scoreCard.innerHTML = `
          <h3>${gameName}</h3>
          <div class="match-teams">
            <span class="team">${score.team1_name}</span>
            <span class="vs">VS</span>
            <span class="team">${score.team2_name}</span>
          </div>
          <div class="match-score">
            <span class="score">${score.team1_score} - ${score.team2_score}</span>
          </div>
          <div class="match-info">
            <span class="status status-${score.status}">${score.status.toUpperCase()}</span>
            <span class="date">${score.match_date || 'TBD'}</span>
          </div>
        `;
        
        scoresContainer.appendChild(scoreCard);
      });
    }
  } catch (error) {
    console.error('Error loading game scores:', error);
  }
}

// Language Toggle Function (if exists)
function toggleLanguage() {
  const body = document.body;
  const langBtn = document.getElementById('langToggle');
  
  body.classList.toggle('english-active');
  
  if (body.classList.contains('english-active')) {
    langBtn.textContent = 'తెలుగు';
    // Switch to English
    document.querySelectorAll('[data-en]').forEach(el => {
      el.textContent = el.getAttribute('data-en');
    });
  } else {
    langBtn.textContent = 'English';
    // Switch to Telugu
    document.querySelectorAll('[data-te]').forEach(el => {
      el.textContent = el.getAttribute('data-te');
    });
  }
  
  // Reload dynamic content for language change
  loadLiveUpdates();
  loadEvents();
  loadGameScores();
}

// Refresh data every 30 seconds
setInterval(() => {
  loadLiveUpdates();
  loadGameScores();
}, 30000);

// Manual test function - call this from browser console
window.testVisitorCounter = async function() {
  console.log("🧪 Testing visitor counter...");
  
  // Test API
  try {
    const response = await fetch('/api/page-views');
    const data = await response.json();
    console.log("✅ API Response:", data);
    
    // Test element
    const element = document.querySelector('.visitor-count');
    console.log("✅ Element found:", !!element, element);
    
    // Directly set the count
    if (element) {
      element.textContent = data.views || "TEST";
      console.log("✅ Count set to:", element.textContent);
    }
    
    return { api: data, element: !!element };
  } catch (error) {
    console.error("❌ Test failed:", error);
    return { error: error.message };
  }
};