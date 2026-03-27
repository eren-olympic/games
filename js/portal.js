document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("games-grid");
    const searchInput = document.getElementById("search-input");
    const filterBtns = document.querySelectorAll(".filter-btn");
    
    let gamesData = [];

    // Fetch the games database
    fetch('/data/games.json')
        .then(res => res.json())
        .then(data => {
            gamesData = data;
            renderGames(gamesData);
        })
        .catch(err => {
            console.error("Error loading games database:", err);
            grid.innerHTML = '<p style="text-align:center;width:100%;color:#ef4444;">Error loading games. Make sure you are running via a local server (e.g. python3 -m http.server).</p>';
        });

    function renderGames(games) {
        grid.innerHTML = '';
        if(games.length === 0) {
            grid.innerHTML = '<p style="text-align:center;width:100%;color:#94a3b8;">No games found matching your search.</p>';
            return;
        }
        
        games.forEach(game => {
            const card = document.createElement('a');
            card.href = game.url;
            card.className = `game-card ${game.id}-card`;
            
            // Scalable styling injection directly from JSON
            if (game.bg) card.style.setProperty('--card-bg', game.bg);
            if (game.opacity) card.style.setProperty('--card-opacity', game.opacity);
            
            // For older CSS that we can't fully remote, we preserve class names, but the variables handle styling natively
            card.innerHTML = `
                <div class="card-content">
                    <span class="tag ${game.category}">${game.category}</span>
                    <h2>${game.title}</h2>
                    <p>${game.desc}</p>
                    <div class="play-btn">Play Now &rarr;</div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // Search and Filter Logic
    let currentFilter = 'all';

    function applyFilters() {
        const query = searchInput.value.toLowerCase();
        
        const filtered = gamesData.filter(game => {
            const matchesFilter = currentFilter === 'all' || game.category === currentFilter;
            const matchesSearch = game.title.toLowerCase().includes(query) || game.desc.toLowerCase().includes(query);
            return matchesFilter && matchesSearch;
        });
        
        renderGames(filtered);
    }

    searchInput.addEventListener('input', applyFilters);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            applyFilters();
        });
    });
});
