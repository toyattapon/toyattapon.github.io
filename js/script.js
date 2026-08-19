/* =========================================================
   1. MOBILE NAV TOGGLE
   - กด hamburger -> เปิด/ปิด class "open" บน <nav>
   ========================================================= */
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

// ปิดเมนูอัตโนมัติเมื่อคลิกลิงก์ (บนมือถือ)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
    navToggle.setAttribute('aria-label', 'Open menu');
  });
});

/* =========================================================
   2. DARK / LIGHT THEME TOGGLE (custom slide switch)
   - #themeToggle ตอนนี้คือ <input type="checkbox"> ที่ซ่อนไว้ (ดู index.html)
     ส่วนที่มองเห็นเป็น track/thumb คุมด้วย CSS ทั้งหมด (ไม่มี icon ในลูกกลมแล้ว)
   - #themeLabel คือคำว่า "Light"/"Dark" ข้างๆ switch เปลี่ยนตามธีม
   - เก็บค่าไว้ใน localStorage เพื่อจำ theme ที่ user เลือกไว้
   ========================================================= */
const themeToggle = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeLabel');
const root = document.documentElement;

function setTheme(theme) {
  const isDark = theme === 'dark';
  if (isDark) {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }
  themeLabel.textContent = isDark ? 'Dark' : 'Light';
  themeToggle.checked = isDark;
  localStorage.setItem('theme', theme);
}

// โหลด theme ที่เคยเลือกไว้ (หรือใช้ตาม system preference ถ้ายังไม่เคยเลือก)
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

// checkbox เปลี่ยนค่า (คลิก/แตะ/กด space) -> สลับธีม
themeToggle.addEventListener('change', () => {
  setTheme(themeToggle.checked ? 'dark' : 'light');
});

/* =========================================================
   3. LANGUAGE TOGGLE (EN / TH)
   - #langToggle คือ checkbox ซ่อนไว้ ใช้ .switch component เดียวกับ theme toggle
   - แปลเฉพาะ element ที่มี data-i18n="..." (paragraph เนื้อหา ไม่แตะ nav/ปุ่ม/ชื่อ skill)
   - ภาษาอังกฤษไม่ต้อง hardcode ซ้ำใน dictionary — ดึงมาจาก innerHTML เดิมใน HTML
     ตอนโหลดหน้าเลย (เก็บไว้เป็น "ต้นฉบับ") ส่วนภาษาไทยเขียนไว้ในนี้
   - ใช้ innerHTML ไม่ใช่ textContent เพราะบางย่อหน้ามี <strong> ฝังอยู่ (เช่น hero.text)
   ========================================================= */
const langToggle = document.getElementById('langToggle');
const langLabel = document.getElementById('langLabel');
const i18nElements = document.querySelectorAll('[data-i18n]');

const translations = {
  en: {}, // เติมอัตโนมัติจาก innerHTML เดิมในหน้า (ดู loop ด้านล่าง)
  th: {
    'hero.eyebrow': 'สวัสดีครับ ผมชื่อ',
    'hero.nameMain': 'อรรถพล บุญเพ็ญ',
    'hero.nameNick': '(ทอย)',
    'hero.text': 'QA Engineer จบสาย Software Engineering มีประสบการณ์ตรงด้าน Manual Testing, Test Automation, API Testing และการทดสอบแอปพลิเคชันทั้งเว็บและมือถือมาแล้วประมาณ 3 ปี ตอนนี้กำลังพัฒนาทักษะเพิ่มเติมด้านการนำ AI มาช่วยงาน และฝึกฝนทักษะการเขียนโปรแกรมเพิ่มเติม',
    'about.reason': 'ผมจบปริญญาตรี คณะวิทยาการสารสนเทศ สาขา Software Engineering เหตุผลที่เลือกทำงานเป็น QA Engineer เพราะมองว่าตำแหน่งนี้บาลานซ์พอดีสำหรับตัวเอง ได้อยู่ฝั่งที่เขียนโค้ดและตรวจสอบคุณภาพไปพร้อมกัน ได้ใช้ทั้ง skill การเขียนโปรแกรมและการทดสอบ/ควบคุมคุณภาพไปด้วยกัน',
    'about.text': 'เป็นคนชอบเรียนรู้สิ่งใหม่อยู่เสมอ ชอบลงมือแก้ปัญหาด้วยตัวเองเพราะทำให้เรียนรู้ได้เร็วขึ้น และมองว่า AI เป็นเครื่องมือที่ช่วยให้พัฒนาตัวเองได้เร็วขึ้นเรื่อยๆ',
    'exp.summary': 'ทดสอบทั้งแบบ Manual และ Automation ครอบคลุมทั้งมือถือ เว็บ และ API ให้กับหลายลูกค้า ทำงานร่วมกับ stakeholder โดยตรงตั้งแต่ทำความเข้าใจ requirement ไปจนถึงตรวจสอบและแก้ปัญหา defect',
    'exp.ais': 'สร้างและดูแล automated test script ด้วย Selenium, Robot Framework, Appium และ Python รวมถึงทดสอบ API ครอบคลุมเรื่อง authentication, status code และ error handling',
    'exp.myhaus': 'ทดสอบแอป MyHaus ตั้งแต่ช่วงเริ่มพัฒนา ครอบคลุมฟีเจอร์บริหารหมู่บ้าน/คอนโด บริการลูกบ้าน และอุปกรณ์ smart-home IoT ทำงานร่วมกับทีม Tuya อย่างใกล้ชิดในการเชื่อมต่ออุปกรณ์',
    'exp.wizlah': 'ทดสอบแบบ Manual บนแพลตฟอร์มเว็บและอีคอมเมิร์ซ',
    'exp.cgs': 'ทดสอบ API แบบ Manual (CGS) และทดสอบเว็บแอปพลิเคชันแบบ Manual (TMP)',
    'proj.homeService': 'ระบบ System Under Test ที่ตั้งใจสร้างขึ้นเพื่อฝึกงาน QA โดยเฉพาะ — มีบทบาท Admin และ Technician, ระบบจองงาน, จ่ายงาน, คลังสินค้า และใบแจ้งหนี้ เชื่อมต่อ PostgreSQL จริง (มี seed/reset ข้อมูลแบบ deterministic และ <code>data-testid</code> พร้อมสำหรับ automation) ตอนนี้กำลังต่อยอดชั้น QA เอง: Playwright E2E test, ตรวจสอบ API/SQL และทำ CI/CD',
    'proj.pimThai': 'แอปฝึกพิมพ์สัมผัสภาษาไทย แรงบันดาลใจจากเครื่องมืออย่าง Monkeytype — กำลังพัฒนาอยู่ เน้นเรื่องความแม่นยำ ลำดับบทเรียน และการฝึกแป้นเกษมณี',
    'proj.vpAir': 'สร้างและเปิดใช้งานเว็บไซต์ WordPress ให้ธุรกิจแอร์ของครอบครัว เชื่อมกับ Facebook Page และ LINE Official Account สำหรับติดต่อลูกค้า พร้อมออกแบบระบบหลังบ้านต้นแบบ (Google Sheets + AppSheet) สำหรับจัดการข้อมูลลูกค้า การจอง ติดตามงาน และออกใบแจ้งหนี้',
    'contact.text': 'ตอนนี้เปิดรับโอกาสงานอยู่ครับ มีความยืดหยุ่นค่อนข้างสูง ถ้าเป็นงานแบบ remote จะพิจารณาเป็นพิเศษ ทักมาคุยกันได้เลยครับ',
    'footer.text': 'สร้างด้วย HTML, CSS และ JavaScript',
  },
};

// เก็บ innerHTML อังกฤษต้นฉบับไว้ก่อนแก้อะไร (ครั้งเดียวตอนโหลดหน้า)
i18nElements.forEach(el => {
  translations.en[el.dataset.i18n] = el.innerHTML.trim();
});

function setLanguage(lang) {
  const isThai = lang === 'th';
  i18nElements.forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang] && translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });
  root.setAttribute('lang', lang); // อัปเดต <html lang="..."> เพื่อ accessibility/SEO
  langLabel.textContent = lang.toUpperCase();
  langToggle.checked = isThai;
  localStorage.setItem('lang', lang);
}

// โหลดภาษาที่เคยเลือกไว้ ไม่งั้นเดาจากภาษาเบราว์เซอร์ของผู้ใช้
const savedLang = localStorage.getItem('lang');
const browserLang = (navigator.language || '').toLowerCase();
setLanguage(savedLang || (browserLang.startsWith('th') ? 'th' : 'en'));

langToggle.addEventListener('change', () => {
  setLanguage(langToggle.checked ? 'th' : 'en');
});

/* =========================================================
   4. ACTIVE NAV LINK ON SCROLL
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
   5. PREVENT RIGHT-CLICK SAVE บนรูปโปรไฟล์ (ตัวกันเบื้องต้น ไม่ใช่การป้องกัน 100%)
   - ย้ายมาจาก inline oncontextmenu="return false" ใน HTML แยก concern ออกจาก markup
   ========================================================= */
const profilePhoto = document.getElementById('profilePhoto');
if (profilePhoto) {
  profilePhoto.addEventListener('contextmenu', (e) => e.preventDefault());
}

/* =========================================================
   6. FOOTER YEAR (อัปเดตปีอัตโนมัติ ไม่ต้องแก้ทุกปี)
   ========================================================= */
document.getElementById('year').textContent = new Date().getFullYear();
