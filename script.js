const PROFILE = { githubUser: "urstrulysaida" };
document.getElementById("year").textContent = new Date().getFullYear();

/* THEME TOGGLE */
const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;
const saved = localStorage.getItem("theme");
if (saved) root.setAttribute("data-theme", saved);
themeToggle.textContent = root.getAttribute("data-theme") === "dark" ? "☀️" : "🌙";
themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  const next = current === "dark" ? "" : "dark";
  if (next) root.setAttribute("data-theme", next);
  else root.removeAttribute("data-theme");
  localStorage.setItem("theme", next);
  themeToggle.textContent = next === "dark" ? "☀️" : "🌙";
});

/* Scroll reveal animations */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.2 });
document.querySelectorAll(".card, .hero, .project-card, .skill, .timeline-item").forEach((el) => observer.observe(el));

/* Fetch GitHub Repos */
async function fetchRepos(username, limit = 6) {
  const noteEl = document.querySelector(".github-fetch-note");
  const grid = document.getElementById("projects-grid");
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=${limit}&sort=updated`);
    if (!res.ok) throw new Error(res.status);
    const repos = await res.json();
    grid.innerHTML = "";
    repos.forEach(r => {
      const el = document.createElement("article");
      el.className = "project-card visible";
      el.innerHTML = `
        <h3><a href="${r.html_url}" target="_blank">${r.name}</a></h3>
        <p>${r.description || "No description"}</p>
        <p class="meta">⭐ ${r.stargazers_count} • Updated ${new Date(r.updated_at).toLocaleDateString()}</p>
      `;
      grid.appendChild(el);
    });
    noteEl.textContent = `Showing ${repos.length} repositories.`;
  } catch {
    noteEl.textContent = "GitHub API failed. Showing static projects.";
  }
}
fetchRepos(PROFILE.githubUser);

/* Contact Form */
document.getElementById("contact-form").addEventListener("submit", () => {
  alert("Mail will open in your email client.");
});
