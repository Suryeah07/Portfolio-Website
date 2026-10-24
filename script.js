/**
 * ==============================================================================
 * PORTFOLIO WEBSITE - INTERACTIVE JAVASCRIPT MODULE
 * ==============================================================================
 * Features:
 * 1. Dark / Light Theme Management with LocalStorage & System Preference
 * 2. Accessible Mobile Navigation Menu (Hamburger toggle, ARIA, ESC close)
 * 3. Dynamic Typewriter / Rotating Subtitle Effect in Hero Section
 * 4. Interactive Project Filter (Category tabs, smooth DOM toggle, ARIA state)
 * 5. Accessible Project Preview Modal (Focus management, Escape key listener)
 * 6. Live Accessible Contact Form Validation with Dynamic Feedback & Mock API
 * 7. ScrollSpy Active Section Highlighting using IntersectionObserver
 * 8. Back to Top Smooth Navigation & Dynamic Footer Year
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ============================================================================
  // 1. THEME SWITCHER (DARK / LIGHT MODE)
  // ============================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;

  // Retrieve stored theme or default to system preference / dark
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  const applyTheme = (theme) => {
    rootElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    if (themeToggleBtn) {
      const isDark = theme === 'dark';
      themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      themeToggleBtn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
  };

  // Initialize theme
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // ============================================================================
  // 2. MOBILE NAVIGATION MENU
  // ============================================================================
  const navToggleBtn = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggleBtn && mainNav) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !mainNav.classList.contains('open');
      mainNav.classList.toggle('open', isOpen);
      navToggleBtn.classList.toggle('open', isOpen);
      navToggleBtn.setAttribute('aria-expanded', String(isOpen));
    };

    navToggleBtn.addEventListener('click', () => toggleMenu());

    // Close menu when clicking any navigation link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (mainNav.classList.contains('open')) {
          toggleMenu(false);
        }
      });
    });

    // Close mobile menu on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        toggleMenu(false);
        navToggleBtn.focus();
      }
    });
  }

  // ============================================================================
  // 3. TYPEWRITER / ROTATING TEXT IN HERO
  // ============================================================================
  const typingTextElement = document.getElementById('typing-text');
  if (typingTextElement) {
    const titles = [
      'Full-Stack Web Developer',
      'Accessibility & UI Specialist',
      'JavaScript & CSS Architect',
      'Problem Solver & Builder'
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 90;
    const deletingSpeed = 45;
    const pauseTime = 1800;

    const typeLoop = () => {
      const currentWord = titles[titleIndex];

      if (isDeleting) {
        typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(typeLoop, pauseTime);
        return;
      }

      if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        setTimeout(typeLoop, 400);
        return;
      }

      const speed = isDeleting ? deletingSpeed : typingSpeed;
      setTimeout(typeLoop, speed);
    };

    // Respect user's reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      setTimeout(typeLoop, 600);
    }
  }

  // ============================================================================
  // 4. INTERACTIVE PROJECT CATEGORY FILTER
  // ============================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedFilter = btn.getAttribute('data-filter');

      // Update ARIA and active states
      filterButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      // Filter project cards with subtle transition
      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        const shouldShow = selectedFilter === 'all' || cardCategory === selectedFilter;

        if (shouldShow) {
          card.classList.remove('is-hidden');
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  // ============================================================================
  // 5. ACCESSIBLE PROJECT PREVIEW MODAL
  // ============================================================================
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalCancelBtn = document.getElementById('modal-cancel');
  const modalTriggers = document.querySelectorAll('.project-modal-trigger');

  let lastFocusedElement = null;

  const projectDetailsMap = {
    shopsphere: {
      title: 'ShopSphere E-Commerce Platform',
      category: 'Frontend & State Management',
      tech: ['HTML5', 'CSS Grid', 'JavaScript (ES6)', 'Web Accessibility'],
      overview: 'ShopSphere is a responsive mock storefront engineered with pure HTML, modern CSS variables, and vanilla JavaScript. It includes live category filtering, a slide-out shopping cart drawer with instant badge count updates, and WCAG AA accessible modal dialogs.',
      features: [
        'Accessible modal dialog with focus trapping and ESC key dismissal',
        'Dynamic cart calculation with tax and shipping logic',
        'Full keyboard navigation for all product grids'
      ]
    },
    taskflow: {
      title: 'TaskFlow Agile Kanban Board',
      category: 'Interactive Application',
      tech: ['JavaScript ES6', 'HTML5 Drag & Drop API', 'Flexbox', 'LocalStorage'],
      overview: 'TaskFlow provides a fluid Kanban workflow for agile project tracking. Users can create tasks, assign priorities, drag items across columns (To Do, In Progress, Done), and persist state locally across browser refreshes.',
      features: [
        'HTML5 Drag and Drop events (dragstart, dragover, drop)',
        'Automatic JSON serializing and local storage sync',
        'Screen-reader announcements upon status updates'
      ]
    },
    skycast: {
      title: 'SkyCast Weather & Climate Dashboard',
      category: 'Tools & REST APIs',
      tech: ['Fetch API', 'CSS Grid & Animations', 'Async/Await', 'SVG Graphics'],
      overview: 'SkyCast delivers real-time weather analytics. It dynamically requests atmospheric data, calculates forecasts, and presents them in an SVG visual temperature curve with animated weather indicator icons.',
      features: [
        'Asynchronous data fetching with robust error handling',
        'Responsive chart rendering without third-party heavy libraries',
        'Graceful offline indicator states'
      ]
    },
    omnichat: {
      title: 'OmniChat AI Assistant Interface',
      category: 'Interactive Application',
      tech: ['JavaScript', 'ARIA Live Regions', 'CSS Flexbox', 'Responsive UI'],
      overview: 'OmniChat is a conversational interface prototype that simulates instant conversational responses with simulated latency, auto-scrolling chat history, and screen reader-friendly live announcement regions.',
      features: [
        'Live message bubbling with auto-scroll to latest entry',
        'Accessible input form with character limits and submit shortcuts',
        'High contrast dark and light colorway integration'
      ]
    }
  };

  const openModal = (projectId, triggerElement) => {
    const data = projectDetailsMap[projectId];
    if (!data || !modal) return;

    lastFocusedElement = triggerElement;

    modalTitle.textContent = data.title;
    modalBody.innerHTML = `
      <p style="margin-bottom: 12px; font-weight: 600; color: var(--accent);">${data.category}</p>
      <p style="margin-bottom: 16px;">${data.overview}</p>
      <h4 style="font-size: 1rem; margin-bottom: 8px; color: var(--text-primary);">Key Architectural Features:</h4>
      <ul style="margin-bottom: 16px; padding-left: 20px; list-style-type: disc;">
        ${data.features.map(f => `<li style="margin-bottom: 6px; color: var(--text-secondary);">${f}</li>`).join('')}
      </ul>
      <h4 style="font-size: 1rem; margin-bottom: 8px; color: var(--text-primary);">Technology Stack:</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        ${data.tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}
      </div>
    `;

    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    modalCloseBtn.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  };

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      const projectId = trigger.getAttribute('data-project');
      openModal(projectId, e.currentTarget);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
        closeModal();
      }
    });
  }

  // ============================================================================
  // 6. ACCESSIBLE CONTACT FORM VALIDATION & SUBMISSION
  // ============================================================================
  const contactForm = document.getElementById('contact-form');
  const formAlert = document.getElementById('form-alert');
  const submitBtn = document.getElementById('submit-btn');
  const submitText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const submitSpinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;

  if (contactForm) {
    const fields = {
      name: {
        input: document.getElementById('user-name'),
        error: document.getElementById('name-error'),
        validate: (value) => {
          if (!value.trim()) return 'Name is required.';
          if (value.trim().length < 2) return 'Name must be at least 2 characters.';
          return '';
        }
      },
      email: {
        input: document.getElementById('user-email'),
        error: document.getElementById('email-error'),
        validate: (value) => {
          if (!value.trim()) return 'Email address is required.';
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value.trim())) return 'Please enter a valid email address (e.g., name@example.com).';
          return '';
        }
      },
      subject: {
        input: document.getElementById('user-subject'),
        error: document.getElementById('subject-error'),
        validate: (value) => {
          if (!value.trim()) return 'Subject is required.';
          if (value.trim().length < 3) return 'Subject must be at least 3 characters.';
          return '';
        }
      },
      message: {
        input: document.getElementById('user-message'),
        error: document.getElementById('message-error'),
        validate: (value) => {
          if (!value.trim()) return 'Message cannot be empty.';
          if (value.trim().length < 10) return 'Message must be at least 10 characters long.';
          return '';
        }
      }
    };

    // Real-time field validation on input & blur
    Object.keys(fields).forEach((key) => {
      const field = fields[key];
      if (!field.input) return;

      const validateField = () => {
        const errorMsg = field.validate(field.input.value);
        if (errorMsg) {
          field.input.classList.add('is-invalid');
          field.input.classList.remove('is-valid');
          field.error.textContent = errorMsg;
          return false;
        } else {
          field.input.classList.remove('is-invalid');
          field.input.classList.add('is-valid');
          field.error.textContent = '';
          return true;
        }
      };

      field.input.addEventListener('blur', validateField);
      field.input.addEventListener('input', () => {
        if (field.input.classList.contains('is-invalid')) {
          validateField();
        }
      });
    });

    // Form Submission Handler
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isFormValid = true;
      let firstInvalidInput = null;

      // Validate all fields
      Object.keys(fields).forEach((key) => {
        const field = fields[key];
        const errorMsg = field.validate(field.input.value);
        if (errorMsg) {
          field.input.classList.add('is-invalid');
          field.input.classList.remove('is-valid');
          field.error.textContent = errorMsg;
          isFormValid = false;
          if (!firstInvalidInput) {
            firstInvalidInput = field.input;
          }
        } else {
          field.input.classList.remove('is-invalid');
          field.input.classList.add('is-valid');
          field.error.textContent = '';
        }
      });

      if (!isFormValid) {
        if (firstInvalidInput) {
          firstInvalidInput.focus();
        }
        formAlert.className = 'form-alert error';
        formAlert.textContent = 'Please correct the errors in the highlighted fields above.';
        formAlert.removeAttribute('hidden');
        return;
      }

      // If valid, initiate async submit simulation
      submitBtn.disabled = true;
      if (submitText) submitText.textContent = 'Sending...';
      if (submitSpinner) submitSpinner.removeAttribute('hidden');
      formAlert.setAttribute('hidden', '');

      setTimeout(() => {
        submitBtn.disabled = false;
        if (submitText) submitText.textContent = 'Send Message';
        if (submitSpinner) submitSpinner.setAttribute('hidden', '');

        // Display accessible success banner
        formAlert.className = 'form-alert success';
        formAlert.textContent = 'Thank you! Your message has been sent successfully. I will get back to you soon.';
        formAlert.removeAttribute('hidden');

        // Reset form and remove validation styling
        contactForm.reset();
        Object.keys(fields).forEach((key) => {
          fields[key].input.classList.remove('is-valid', 'is-invalid');
          fields[key].error.textContent = '';
        });

        // Set focus to the alert for screen readers
        formAlert.setAttribute('tabindex', '-1');
        formAlert.focus();
      }, 1200);
    });
  }

  // ============================================================================
  // 7. SCROLLSPY (ACTIVE NAVIGATION LINK HIGHLIGHTING)
  // ============================================================================
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((section) => sectionObserver.observe(section));
  }

  // ============================================================================
  // 8. BACK TO TOP BUTTON & AUTOMATIC CURRENT YEAR
  // ============================================================================
  const backToTopBtn = document.getElementById('back-to-top');
  const currentYearSpan = document.getElementById('current-year');

  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
