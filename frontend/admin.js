import { renderNav, API } from './common.js';
document.getElementById('nav').innerHTML = renderNav('login');

const msg = document.getElementById('msg');
document.getElementById('token').value = localStorage.getItem('adminToken') || '';

async function refresh() {
  const res = await fetch(API('/listEvents'));
  const data = await res.json();
  data.sort((a, b) => new Date(a.date) - new Date(b.date));

  document.getElementById('eventsGrid').innerHTML = data.map(ev => `
    <div class="card">
      <div class="meta">${new Date(ev.date).toLocaleString()} · ${ev.location}</div>
      <div class="title" style="color:#292D3E">${ev.title}</div>
      <div class="meta">Club: <b>${ev.club}</b></div>
      <p>${ev.description}</p>
    </div>`).join('') || '<div class="card">No events yet.</div>';
}

refresh();

document.getElementById('eventForm').onsubmit = async (e) => {
  e.preventDefault();
  const payload = {
    token: document.getElementById('token').value.trim(),
    title: document.getElementById('title').value.trim(),
    club: document.getElementById('club').value.trim(),
    date: new Date(document.getElementById('date').value).toISOString(),
    location: document.getElementById('location').value.trim(),
    description: document.getElementById('desc').value.trim()
  };

  const res = await fetch(API('/addEvent'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const out = await res.json();
  msg.style.color = res.ok ? '#16a34a' : '#dc2626';
  msg.textContent = out.message || (res.ok ? 'Event created!' : 'Failed');
  if (res.ok) {
    e.target.reset();
    refresh();
  }
};
