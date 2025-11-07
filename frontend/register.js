import { renderNav, API } from './common.js';
document.getElementById('nav').innerHTML = renderNav('student');

const sel = document.getElementById('eventSel');
const msg = document.getElementById('msg');

async function fillEvents(){
  const res = await fetch(API('/listEvents'));
  const events = await res.json();
  events.sort((a,b)=> new Date(a.date)-new Date(b.date));
  const url = new URL(location.href);
  const id = url.searchParams.get('event');
  sel.innerHTML = events.map(e=>`<option value="${e.id}" ${e.id===id?'selected':''}>${e.title}</option>`).join('');
}
fillEvents();

document.getElementById('regForm').onsubmit = async e=>{
  e.preventDefault();
  const payload = {
    eventId: sel.value,
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    dept: document.getElementById('dept').value.trim()
  };
  const res = await fetch(API('/register'), {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
  const out = await res.json();
  msg.style.color = res.ok ? '#16a34a' : '#dc2626';
  msg.textContent = out.message || (res.ok ? 'Registered!' : 'Failed');
  if(res.ok) e.target.reset();
};
