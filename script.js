/* -------------------------
  PROFILE: Edit these values
------------------------- */
const PROFILE = {
  name: "Shaik Saida Vali",
  githubUser: "urstrulysaida",
  resume: "https://docs.google.com/document/d/1UBfhBcEI_hzWj1KOlvlD4vjbkhmVV1ZNFayQrkroXZA/edit",
  linkedin: "https://in.linkedin.com/in/shaiksaidavali",
  email: "shaiksaidavali.in@gmail.com",
  phone: "+91 7674012184",
};

/* -------------------------
  DOM helpers & setup
------------------------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* theme toggle persisted in localStorage */
const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;
const saved = localStorage.getItem("theme");
if (saved) root.setAttribute("data-theme", saved);
themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  const next = current === "dark" ? "" : "dark";
  if (next) root.setAttribute("data-theme", next);
  else root.removeAttribute("data-theme");
  localStorage.setItem("theme", next);
  themeToggle.setAttribute("aria-pressed", next === "dark");
  themeToggle.textContent = next === "dark" ? "☀️" : "🌙";
});

/* set initial toggle text */
themeToggle.textContent = root.getAttribute("data-theme") === "dark" ? "☀️" : "🌙";

/* -------------------------
  GitHub repos fetcher
  - public REST API, unauthenticated
  - fallback: show seed projects already in HTML
------------------------- */
async function fetchRepos(username, limit = 6) {
  const noteEl = document.querySelector(".github-fetch-note");
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=${limit}&sort=updated`);
    if (!res.ok) throw new Error("GitHub API error: " + res.status);
    const repos = await res.json();
    if (!Array.isArray(repos) || repos.length === 0) {
      noteEl.textContent = "No public repositories found or rate-limited.";
      return;
    }
    noteEl.textContent = `Showing ${repos.length} latest public repos.`;
    renderRepos(repos);
  } catch (err) {
    console.warn(err);
    document.querySelector(".github-fetch-note").textContent = "Could not fetch GitHub repos. Showing seeded projects.";
  }
}

function renderRepos(repos) {
  const grid = document.getElementById("projects-grid");
  // remove seeded project cards (3) before rendering dynamic ones
  grid.innerHTML = "";
  repos.forEach(r => {
    const article = document.createElement("article");
    article.className = "project-card";
    article.innerHTML = `
      <h3><a href="${r.html_url}" target="_blank" rel="noopener">${escapeHtml(r.name)}</a></h3>
      <p>${escapeHtml(r.description || "No description provided.")}</p>
      <p class="meta">⭐ ${r.stargazers_count} • Updated ${new Date(r.updated_at).toLocaleDateString()}</p>
    `;
    grid.appendChild(article);
  });
}

/* small helper to avoid bare HTML injection */
function escapeHtml(str){
  return String(str).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}

/* -------------------------
  Contact form — mailto fallback
  Replace with serverless endpoint for production.
------------------------- */
const contactForm = document.getElementById("contact-form");
contactForm.addEventListener("submit", (e) => {
  // default behavior will open user's mail client because action=mailto
  // Provide immediate feedback.
  alert("Your message will open in your email client. For production use integrate a serverless form endpoint.");
});

/* -------------------------
  Initialize
------------------------- */
(function init(){
  // update hero contact info automatically (if you want to)
  // (optional) populate any dynamic fields with PROFILE
  fetchRepos(PROFILE.githubUser, 6);
})();
