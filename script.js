// script.js

// AWS Configuration - Using IAM Roles (SECURE - No credentials needed!)
const AWS_CONFIG = {
  region: 'us-east-1' // Change to your preferred AWS region
};

// Initialize AWS with IAM role authentication
let dynamoDB = null;
try {
  AWS.config.update(AWS_CONFIG);
  dynamoDB = new AWS.DynamoDB.DocumentClient();
  console.log('✅ AWS SDK initialized with IAM role authentication');
} catch (error) {
  console.log('⚠️ AWS SDK not available or IAM role not configured:', error.message);
}

// Visitor tracking function
function trackVisitor() {
  if (!dynamoDB) return;

  const today = new Date().toISOString().split('T')[0];
  const timestamp = new Date().toISOString();
  
  const visitorInfo = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referrer: document.referrer || 'Direct',
    timestamp: timestamp
  };

  const params = {
    TableName: 'website-visitors',
    Key: { 'date': today },
    UpdateExpression: 'ADD visitor_count :inc SET last_updated = :timestamp, visitor_info = list_append(if_not_exists(visitor_info, :empty_list), :visitor)',
    ExpressionAttributeValues: {
      ':inc': 1,
      ':timestamp': timestamp,
      ':visitor': [visitorInfo],
      ':empty_list': []
    },
    ReturnValues: 'UPDATED_NEW'
  };

  dynamoDB.update(params, (err, data) => {
    if (err) {
      console.error('Error tracking visitor:', err);
    } else {
      updateVisitorDisplay(data.Attributes.visitor_count);
    }
  });
}

// Function to get and display visitor count
function getVisitorCount() {
  if (!dynamoDB) return;

  const params = {
    TableName: 'website-visitors'
  };

  dynamoDB.scan(params, (err, data) => {
    if (err) {
      console.error('Error getting visitor count:', err);
    } else {
      let totalVisitors = 0;
      if (data.Items) {
        data.Items.forEach(item => {
          totalVisitors += item.visitor_count || 0;
        });
      }
      updateVisitorDisplay(totalVisitors);
    }
  });
}

// Update visitor count display
function updateVisitorDisplay(count) {
  const visitorElement = document.getElementById('visitor-count');
  if (visitorElement) {
    visitorElement.textContent = count;
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  setupSmoothScroll();
  handleFormSubmit();
  
  // Track visitor and get count
  trackVisitor();
  getVisitorCount();
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
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('nameInput')?.value;
    const email = document.getElementById('emailInput')?.value;
    const message = document.getElementById('messageInput')?.value;
    
    if (name && email && message) {
      // Store message in localStorage
      let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
      
      const newMessage = {
        name: name,
        email: email,
        message: message,
        timestamp: new Date().toLocaleString('en-IN')
      };
      
      messages.push(newMessage);
      localStorage.setItem('contactMessages', JSON.stringify(messages));
      
      console.log('📧 Message saved! Total messages: ' + messages.length);
      console.log('Messages stored in browser localStorage with key: "contactMessages"');
      
      alert('✅ Message sent successfully!\n\nMessages are stored in your browser\'s localStorage.\nTo view: Open DevTools (F12) > Application > Local Storage > contactMessages');
      
      // Reset form
      form.reset();
    }
  });
}

// Auto-update live scores
document.addEventListener("DOMContentLoaded", () => {
  const cricketScores = document.getElementById("cricket-scores");
  const kabaddiScores = document.getElementById("kabaddi-scores");

  setTimeout(() => {
    if (cricketScores) cricketScores.innerHTML = "<p>🏏 Kalepalle XI 78/2 (10 overs)</p>";
    if (kabaddiScores) kabaddiScores.innerHTML = "<p>🤸 Team A 32 - Team B 29</p>";
  }, 5000);
});