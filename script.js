// script.js

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  setupSmoothScroll();
  handleFormSubmit();
  initializeChatbot();
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

// Chatbot functionality
function initializeChatbot() {
  // Add a small delay to ensure DOM is fully loaded
  setTimeout(() => {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const quickQuestions = document.querySelectorAll('.quick-question');

    // Check if elements exist
    if (!chatbotToggle || !chatbotWindow) {
      console.error('Chatbot elements not found');
      return;
    }

    console.log('Chatbot initialized successfully!');

    // FAQ database with Telugu and English responses
    const faqs = {
      dates: {
        te: "సంక్రాంతి పండుగ జనవరి 14-16, 2026 నుంచి నిర్వహించబడుతుంది. మూడు రోజుల పాటు వివిధ కార్యక్రమాలు ఉంటాయి.",
        en: "Sankranthi festival will be celebrated from January 14-16, 2026. Various events will be held for three days."
      },
      events: {
        te: "కార్యక్రమాలు: భోగి (జన 14), సంక్రాంతి (జన 15), కనుమ (జన 16). ప్రతిరోజూ సాంస్కృతిక కార్యక్రమాలు, ఆటలు, మరియు విందులు ఉంటాయి.",
        en: "Events include: Bhogi (Jan 14), Sankranthi (Jan 15), Kanuma (Jan 16). Daily cultural programs, games, and feasts will be organized."
      },
      games: {
        te: "క్రికెట్, కబడ్డీ, వాలీబాల్, మరియు సాంప్రదాయ ఆటలు నిర్వహించబడతాయి. రిజిస్ట్రేషన్ కోసం గ్రామ కమిటీని సంప్రదించండి.",
        en: "Cricket, Kabaddi, Volleyball, and traditional games will be organized. Contact the village committee for registration."
      },
      location: {
        te: "పి మోహన్/దినేష్ పొలంలో",
        en: "At P Mohan/Dinesh field"
      },
      food: {
        te: "సాంప్రదాయ సంక్రాంతి వంటకాలు: పొంగలి, పుల్లిహోర, పప్పు చారు, మరియు తీపి పదార్థాలు అందించబడతాయి.",
        en: "Traditional Sankranthi dishes: Pongali, Pulihora, Pappu chaaru, and sweets will be served."
      },
      contact: {
        te: "మరిన్ని వివరాలకు గ్రామ కమిటీ చైర్మన్‌ని లేదా ఈ వెబ్‌సైట్‌లోని కాంటాక్ట్ సెక్షన్‌ని చూడండి.",
        en: "For more details, contact the village committee chairman or check the contact section on this website."
      }
    };

    // Get current language from the global variable or default to Telugu
    function getCurrentLanguage() {
    // Check if currentLanguage is defined globally (from the HTML language toggle)
    if (typeof window.currentLanguage !== 'undefined') {
      return window.currentLanguage;
    }
    // Fallback to localStorage
    return localStorage.getItem('selectedLanguage') || 'te';
  }

    // Toggle chatbot window
    chatbotToggle.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Chatbot toggle clicked!');
      chatbotWindow.classList.toggle('active');
    });

    // Close chatbot window
    chatbotClose.addEventListener('click', () => {
      chatbotWindow.classList.remove('active');
    });

    // Handle quick questions
    quickQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const questionType = question.getAttribute('data-question');
        const currentLang = getCurrentLanguage();
        
        // Add user message
        addMessage(question.textContent, 'user');
        
        // Add bot response
        setTimeout(() => {
          const response = faqs[questionType] ? faqs[questionType][currentLang] : getDefaultResponse(currentLang);
          addMessage(response, 'bot');
        }, 500);
      });
    });

    // Handle text input
    function handleUserMessage() {
      const message = chatbotInput.value.trim();
      if (!message) return;

      addMessage(message, 'user');
      chatbotInput.value = '';

      // Process the message and get response
      setTimeout(() => {
        const response = processUserMessage(message);
        addMessage(response, 'bot');
      }, 500);
    }

    // Send button click
    chatbotSend.addEventListener('click', handleUserMessage);

    // Enter key press
    chatbotInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleUserMessage();
      }
    });

    // Add message to chat
    function addMessage(message, sender) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `chatbot-message ${sender}-message`;
      
      const messageContent = document.createElement('div');
      messageContent.className = 'message-content';
      messageContent.textContent = message;
      
      messageDiv.appendChild(messageContent);
      chatbotMessages.appendChild(messageDiv);
      
      // Scroll to bottom
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Process user message and return appropriate response
    function processUserMessage(message) {
      const currentLang = getCurrentLanguage();
      const lowerMessage = message.toLowerCase();

      // Keywords for different topics
      const keywords = {
        dates: ['date', 'when', 'time', 'ఎప్పుడు', 'తేదీ', 'సమయం'],
        events: ['event', 'program', 'celebration', 'కార్యక్రమ', 'వేడుక', 'పండుగ'],
        games: ['game', 'sport', 'cricket', 'kabaddi', 'ఆట', 'క్రికెట్', 'కబడ్డీ'],
        location: ['where', 'place', 'location', 'venue', 'ఎక్కడ', 'స్థలం', 'చోట్ల'],
        food: ['food', 'eat', 'meal', 'భోజనం', 'తిండి', 'వంట'],
        contact: ['contact', 'phone', 'call', 'సంప్రదించ', 'ఫోన్', 'కాల్']
      };

      // Find matching category
      for (const [category, words] of Object.entries(keywords)) {
        if (words.some(keyword => lowerMessage.includes(keyword))) {
          return faqs[category][currentLang];
        }
      }

      // Default response for unmatched queries
      return getDefaultResponse(currentLang);
    }

    function getDefaultResponse(lang) {
      const responses = {
        te: "క్షమించండి, నేను ఆ ప్రశ్న అర్థం చేసుకోలేకపోయాను. దయచేసి మీరు క్విక్ ప్రశ్నలను ఉపయోగించండి లేదా సంక్రాంతి పండుగ గురించి అడగండి.",
        en: "Sorry, I didn't understand that question. Please use the quick questions or ask about the Sankranthi festival."
      };
      return responses[lang];
    }

    // Update chatbot language when main language changes
    function updateChatbotLanguage() {
      try {
        // Update placeholder text
        const currentLang = getCurrentLanguage();
        console.log('Chatbot updating to language:', currentLang);
        const placeholder = currentLang === 'en' ? "Type your question..." : "మీ ప్రశ్న టైప్ చేయండి...";
        if (chatbotInput) {
          chatbotInput.setAttribute('placeholder', placeholder);
        }
        
        // Update data attributes for language switching
        const chatbotElements = document.querySelectorAll('#chatbot-container [data-te][data-en]');
        chatbotElements.forEach(el => {
          const text = currentLang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-te');
          if (text) {
            el.textContent = text;
          }
        });
      } catch (error) {
        console.error('Error updating chatbot language:', error);
      }
    }

    // Override the main website's applyLanguage function
    if (typeof window.applyLanguage === 'function') {
      const originalApplyLanguage = window.applyLanguage;
      window.applyLanguage = function() {
        originalApplyLanguage();
        setTimeout(() => {
          updateChatbotLanguage();
        }, 100);
      };
    }

    // Listen for language changes by checking periodically
    let lastLanguage = getCurrentLanguage();
    const languageChecker = setInterval(() => {
      const newLanguage = getCurrentLanguage();
      if (newLanguage !== lastLanguage) {
        console.log('Language changed from', lastLanguage, 'to', newLanguage);
        updateChatbotLanguage();
        lastLanguage = newLanguage;
      }
    }, 1000);

    // Initial language setup
    updateChatbotLanguage();
    
  }, 200);
}