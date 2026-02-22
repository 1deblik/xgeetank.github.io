// Initialize Lucide Icons
lucide.createIcons();

// --- Anti-Lag Custom Cursor ---
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

let mouseX = -100;
let mouseY = -100;
let outlineX = -100;
let outlineY = -100;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  // Immediate update for dot to reduce perceived input lag (Anti-lagger)
  cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
});

// Smooth interpolation for outline using requestAnimationFrame
const speed = 0.2;
function animateCursor() {
  const dx = mouseX - outlineX;
  const dy = mouseY - outlineY;
  
  outlineX += dx * speed;
  outlineY += dy * speed;
  
  cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
  
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effect
document.addEventListener('mouseover', (e) => {
  if (e.target.closest('a, button, .hover-trigger')) {
    cursorOutline.classList.add('hovering');
  } else {
    cursorOutline.classList.remove('hovering');
  }
});

// --- Lanyard API (Discord Status) ---
const LANYARD_USER_ID = '936962857915019274';
const discordCard = document.getElementById('discord-card');

async function fetchLanyard() {
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${LANYARD_USER_ID}`);
    const json = await res.json();
    if (json.success) {
      updateDiscordCard(json.data);
    }
  } catch (e) {
    console.error("Failed to fetch Lanyard data", e);
  }
}

function updateDiscordCard(data) {
  const { discord_user, discord_status, activities } = data;
  const avatarUrl = discord_user.avatar
    ? `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png?size=256`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  const primaryActivity = activities.find(a => a.type === 0) || activities[0];
  
  let activityHtml = `
    <div class="bg-white/5 rounded-xl p-3 border border-white/5">
      <p class="text-sm text-white/60">Chilling in the digital void.</p>
    </div>
  `;

  if (primaryActivity) {
    const typeText = primaryActivity.type === 2 ? 'Listening to' : 'Playing';
    activityHtml = `
      <div class="bg-white/5 rounded-xl p-3 border border-white/5">
        <p class="text-[10px] text-white/40 uppercase tracking-wider font-bold mb-1">${typeText}</p>
        <p class="text-sm text-white font-medium truncate">${primaryActivity.name}</p>
        ${primaryActivity.details ? `<p class="text-xs text-white/60 truncate">${primaryActivity.details}</p>` : ''}
        ${primaryActivity.state ? `<p class="text-xs text-white/60 truncate">${primaryActivity.state}</p>` : ''}
      </div>
    `;
  }

  discordCard.innerHTML = `
    <div class="absolute inset-0 bg-gradient-to-br from-[#5865F2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div class="relative z-10 flex flex-col h-full">
      <div class="flex items-start justify-between mb-4">
        <div class="relative">
          <img src="${avatarUrl}" alt="Discord Avatar" class="w-16 h-16 rounded-full border-2 border-[#0a0a0a]" />
          <div class="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0a0a0a] status-${discord_status}"></div>
        </div>
        <i data-lucide="message-square" class="text-white/20 w-6 h-6"></i>
      </div>
      <div class="mt-auto">
        <h3 class="font-montserrat font-light text-3xl text-white mb-0.5">${discord_user.global_name || discord_user.username}</h3>
        <p class="text-white/50 text-sm font-mono mb-4">@${discord_user.username}</p>
        ${activityHtml}
      </div>
    </div>
  `;
  lucide.createIcons();
}

fetchLanyard();
setInterval(fetchLanyard, 15000);

// --- GitHub API (Projects) ---
const GITHUB_USERNAME = '1deblik';
const projectsGrid = document.getElementById('projects-grid');

async function fetchGitHub() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`);
    const data = await res.json();
    
    if (Array.isArray(data)) {
      // Filter out forks and only include repos that have a language (code)
      const repos = data.filter(r => !r.fork && r.language !== null).slice(0, 4);
      projectsGrid.innerHTML = repos.map(repo => `
        <a href="${repo.html_url}" target="_blank" rel="noreferrer" class="glass-panel rounded-3xl group hover-trigger block hw-accel overflow-hidden flex flex-col">
          <div class="h-48 w-full overflow-hidden border-b border-white/10 relative">
            <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
            <img src="https://opengraph.githubassets.com/1/${repo.owner.login}/${repo.name}" alt="${repo.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div class="p-8 flex-1 flex flex-col">
            <div class="flex justify-between items-start mb-4">
              <h3 class="font-montserrat font-light text-2xl text-white group-hover:text-[#5865F2] transition-colors">${repo.name}</h3>
              <i data-lucide="external-link" class="w-5 h-5 text-white/20 group-hover:text-white/60 transition-colors"></i>
            </div>
            <p class="text-white/60 mb-6 line-clamp-2 text-sm flex-1">
              ${repo.description || "No description provided. The code speaks for itself."}
            </p>
            <div class="flex items-center gap-4 text-sm font-mono text-white/40 mt-auto">
              <span class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-white/20"></span>
                ${repo.language}
              </span>
              <span class="flex items-center gap-1.5">
                <i data-lucide="star" class="w-4 h-4"></i> ${repo.stargazers_count}
              </span>
              <span class="flex items-center gap-1.5">
                <i data-lucide="git-fork" class="w-4 h-4"></i> ${repo.forks_count}
              </span>
            </div>
          </div>
        </a>
      `).join('');
      lucide.createIcons();
    } else {
      projectsGrid.innerHTML = `<p class="text-red-400/80 font-mono">Failed to load projects.</p>`;
    }
  } catch (e) {
    projectsGrid.innerHTML = `<p class="text-red-400/80 font-mono">Failed to load projects.</p>`;
  }
}

fetchGitHub();
