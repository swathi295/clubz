export const API = (path) => path.startsWith('http') ? path : `/api${path}`;

export function renderNav(active) {
  return `
  <nav class="nav">
    <div class="container row">
      <div class="brand"><span class="dot"></span>CLUBz</div>
      <div class="menu">
        <a href="home.html"${active==='home'?' style="font-weight:700"':''}>Home</a>
        <a href="student.html"${active==='student'?' style="font-weight:700"':''}>Events</a>
        <a href="login.html"${active==='login'?' style="font-weight:700"':''}>Login</a>
      </div>
    </div>
  </nav>`;
}

export function guardAdmin() {
  const role = localStorage.getItem('role');
  if (role !== 'admin') location.href = 'login.html';
}

export function guardStudent() {
  const role = localStorage.getItem('role');
  if (!role || role === 'admin') location.href = 'login.html';
}
