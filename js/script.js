/* =========================================================
   1. MOBILE NAV TOGGLE
   - กด hamburger -> เปิด/ปิด class "open" บน <nav>
   ========================================================= */
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// ปิดเมนูอัตโนมัติเมื่อคลิกลิงก์ (บนมือถือ)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

/* =========================================================
   2. DARK / LIGHT THEME TOGGLE
   - เก็บค่าไว้ใน localStorage เพื่อจำ theme ที่ user เลือกไว้
   ========================================================= */
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function setTheme(theme) {
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
  } else {
    root.removeAttribute('data-theme');
    themeToggle.textContent = '🌙';
  }
  localStorage.setItem('theme', theme);
}

// โหลด theme ที่เคยเลือกไว้ (หรือใช้ตาม system preference ถ้ายังไม่เคยเลือก)
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  setTheme(current === 'dark' ? 'light' : 'dark');
});

/* =========================================================
   3. ACTIVE NAV LINK ON SCROLL
   - ใช้ IntersectionObserver เช็คว่า section ไหนอยู่ในจอ
     แล้ว highlight nav link ที่ตรงกัน
   ========================================================= */
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' }); // ถือว่า "active" เมื่อ section อยู่กลางจอ

sections.forEach(section => observer.observe(section));

/* =========================================================
   4. FOOTER YEAR (อัปเดตปีอัตโนมัติ ไม่ต้องแก้ทุกปี)
   ========================================================= */
document.getElementById('year').textContent = new Date().getFullYear();
