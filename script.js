// script.js

// Example: Auto-update live scores
document.addEventListener("DOMContentLoaded", () => {
  const cricketScores = document.getElementById("cricket-scores");
  const kabaddiScores = document.getElementById("kabaddi-scores");

  // Simulated live update (replace with API or JSON later)
  setTimeout(() => {
    cricketScores.innerHTML = "<p>🏏 Kalepalle XI 78/2 (10 overs)</p>";
    kabaddiScores.innerHTML = "<p>🤸 Team A 32 - Team B 29</p>";
  }, 5000);
});

// Example: Smooth scroll for nav links
document.querySelectorAll(".nav-list a").forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});