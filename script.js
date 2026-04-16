/* =========================================
   PORTFOLIO — script.js
   Author: Your Name
   ========================================= */

/* =====================
   1. AOS INIT (Animate on Scroll)
   ===================== */
AOS.init({
  duration: 700,       // animation duration in ms
  once: true,          // only animate once per element
  easing: 'ease-out',
  offset: 60,          // trigger offset from viewport bottom
});


/* =====================
   2. CUSTOM CURSOR
   ===================== */
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

if (cursor && cursorFollower) {
  document.addEventListener('mousemove', (e) => {
    // Main cursor follows mouse instantly
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    // Follower lags slightly (via CSS transition)
    cursorFollower.style.left = e.clientX + 'px';
    cursorFollower.style.top  = e.clientY + 'px';
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorFollower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorFollower.style.opacity = '0.5';
  });
}


/* =====================
   3. NAVBAR
   ===================== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');

// Navbar shadow on scroll
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  updateActiveNav();
});

// Hamburger menu toggle (mobile)
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close menu when a nav link is clicked
navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// Active nav link on scroll (highlight section in view)
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop    = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId     = section.getAttribute('id');
    const navLink       = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinkItems.forEach(l => l.classList.remove('active'));
      if (navLink) navLink.classList.add('active');
    }
  });
}


/* =====================
   4. DARK / LIGHT THEME TOGGLE
   ===================== */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');

// Load saved theme from localStorage
const savedTheme = localStorage.getItem('portfolioTheme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('portfolioTheme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  // Sun icon = currently dark (click to go light)
  // Moon icon = currently light (click to go dark)
  themeIcon.className = theme === 'dark' ? 'bx bx-sun' : 'bx bx-moon';
}


/* =====================
   5. TYPING ANIMATION (Home role text)
   ===================== */
const typedTextEl = document.getElementById('typedText');
const phrases = [
  'Computer Science Student',
  'Problem Solver',
  'C++ Programmer',
  'Always Learning',
];

let phraseIndex = 0;   // which phrase we're on
let charIndex   = 0;   // how many chars typed
let isDeleting  = false;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    // Remove one character
    typedTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    // Add one character
    typedTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 100; // typing is slower than deleting

  if (!isDeleting && charIndex === currentPhrase.length) {
    // Pause at end of phrase, then start deleting
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Move to next phrase
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  setTimeout(typeEffect, delay);
}

typeEffect(); // kick off the animation


/* =====================
   6. PROJECT FILTER TABS
   ===================== */
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const show = filter === 'all' || category === filter;

      if (show) {
        card.classList.remove('hidden');
        // Small fade-in animation
        card.style.animation = 'none';
        void card.offsetWidth; // force reflow
        card.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// Add fadeIn keyframe dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);


/* =====================
   7. SKILL BAR ANIMATION
   ===================== */
// Uses IntersectionObserver — fills bars when skills section enters view
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const targetWidth = fill.getAttribute('data-width') + '%';
      // Delay slightly for stagger effect
      setTimeout(() => {
        fill.style.width = targetWidth;
      }, 200);
      skillObserver.unobserve(fill); // only animate once
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));


/* =====================
   8. CONTACT FORM VALIDATION & SUBMIT
   ===================== */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn   = document.getElementById('submitBtn');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault(); // prevent real form submission (frontend only)

  const isValid = validateForm();

  if (isValid) {
    // Simulate sending (show loading state)
    submitBtn.classList.add('loading');
    submitBtn.querySelector('span').textContent = 'Sending...';

    setTimeout(() => {
      // Reset button and show success message
      submitBtn.classList.remove('loading');
      submitBtn.querySelector('span').textContent = 'Send Message';
      contactForm.reset();
      formSuccess.classList.add('show');

      // Hide success message after 5 seconds
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1800); // simulated 1.8s delay
  }
});

function validateForm() {
  let valid = true;

  // Field rules: [inputId, errorId, validation function, error message]
  const rules = [
    ['name',    'nameError',    v => v.trim().length >= 2,     'Please enter your full name.'],
    ['email',   'emailError',   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Please enter a valid email.'],
    ['subject', 'subjectError', v => v.trim().length >= 3,     'Subject must be at least 3 characters.'],
    ['message', 'messageError', v => v.trim().length >= 10,    'Message must be at least 10 characters.'],
  ];

  rules.forEach(([id, errId, validate, msg]) => {
    const input = document.getElementById(id);
    const error = document.getElementById(errId);
    const value = input.value;

    if (!validate(value)) {
      error.textContent = msg;
      input.classList.add('error');
      valid = false;
    } else {
      error.textContent = '';
      input.classList.remove('error');
    }
  });

  return valid;
}

// Clear error on input
['name', 'email', 'subject', 'message'].forEach(id => {
  const input = document.getElementById(id);
  const error = document.getElementById(id + 'Error');
  input.addEventListener('input', () => {
    input.classList.remove('error');
    error.textContent = '';
  });
});


/* =====================
   9. SMOOTH SCROLL (fallback for older browsers)
   ===================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* =====================
   10. SCROLL PROGRESS INDICATOR (optional thin bar at top)
   ===================== */
// Creates a thin progress bar at top of page as you scroll
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  height: 2px;
  background: var(--accent);
  width: 0%;
  z-index: 9999;
  transition: width 0.1s linear;
  pointer-events: none;
`;
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / scrollTotal) * 100;
  progressBar.style.width = progress + '%';
});