import { renderNav } from './common.js';
document.getElementById('nav').innerHTML = renderNav('login');

const roleSel = document.getElementById('role');
const adminBlock = document.getElementById('adminBlock');
roleSel.onchange = ()=> adminBlock.style.display = roleSel.value==='admin' ? 'block' : 'none';

document.getElementById('loginBtn').onclick = ()=>{
  const role = roleSel.value;
  if(role==='admin'){
    const token = document.getElementById('adminToken').value.trim();
    if(!token) return document.getElementById('msg').textContent='Token required';
    localStorage.setItem('role','admin');
    localStorage.setItem('adminToken',token);
    location.href='admin.html';
  } else {
    localStorage.setItem('role','student');
    location.href='student.html';
  }
};
