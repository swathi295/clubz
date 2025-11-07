import { renderNav, API } from './common.js';
document.getElementById('nav').innerHTML = renderNav('home');

async function loadEvents() {
  try {
    const res = await fetch(API('/listEvents'));
    const events = await res.json();
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    document.getElementById('eventsGrid').innerHTML = events.slice(0, 3).map(ev => `
      <div class="card">
        <div class="meta">${new Date(ev.date).toLocaleString()} · ${ev.location}</div>
        <div class="title" style="color:#292D3E">${ev.title}</div>
        <p>${ev.description}</p>
        <a class="btn" href="register.html?event=${encodeURIComponent(ev.id)}">Register</a>
      </div>
    `).join('') || '<div class="card">No events yet.</div>';
  } catch (err) {
    document.getElementById('eventsGrid').innerHTML = '<div class="card">Error loading events.</div>';
    console.error(err);
  }
}
loadEvents();
