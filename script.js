// Smooth scroll for nav links
document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Dummy live scores (replace with API later)
function loadScores() {
    document.getElementById("cricket-scores").innerHTML =
        "🏏 India 145/4 (18 overs)";
    document.getElementById("kabaddi-scores").innerHTML =
        "🤸 Team A 28 - Team B 26";
}

// Simulate loading after 2 seconds
setTimeout(loadScores, 2000);

// Live match placeholder
document.getElementById("live-match-container").innerHTML =
    "<p>🏏 Cricket Match: Kalepalle XI vs Guests — Starts at 4 PM</p>";