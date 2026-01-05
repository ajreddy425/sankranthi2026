// script.js

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  setupSmoothScroll();
  handleFormSubmit();
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