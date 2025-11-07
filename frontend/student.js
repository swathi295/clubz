import { renderNav } from './common.js';

// Render top navigation bar for student view
document.getElementById('nav').innerHTML = renderNav('student');

// Azure Blob JSON URL
const blobURL = "https://stclubportalss.blob.core.windows.net/clubdata/events.json";

// Load and render events dynamically
async function loadEvents() {
  const container = document.getElementById('eventsGrid');
  container.innerHTML = `<div class="card">Loading events...</div>`;

  try {
    const res = await fetch(`${blobURL}?t=${Date.now()}`); // prevent caching
    if (!res.ok) throw new Error("Failed to load events from Azure Blob Storage");

    const data = await res.json();
    const events = data.clubs || [];

    if (events.length === 0) {
      container.innerHTML = '<div class="card">No events yet.</div>';
      return;
    }

    // Sort by date
    events.sort((a, b) => new Date(a.next_event) - new Date(b.next_event));

    // Render cards
    container.innerHTML = events
      .map(ev => `
        <div class="card">
          <div class="meta">${ev.next_event}</div>
          <div class="title" style="color:#292D3E">${ev.name}</div>
          <p>${ev.about}</p>
          <a class="btn" href="register.html?event=${encodeURIComponent(ev.name)}">Register</a>
        </div>
      `)
      .join('');
  } catch (err) {
    console.error("Error loading events:", err);
    container.innerHTML = `<div class="card">⚠️ Error loading events: ${err.message}</div>`;
  }
}

// Run on page load
document.addEventListener("DOMContentLoaded", loadEvents);


