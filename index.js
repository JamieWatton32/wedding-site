/* ============================================================
   INDEX.JS — Wedding Site Interactions
   - Countdown timer
   - Smooth-scroll navigation with active state
   - Nav show/hide on scroll
   - Mobile hamburger menu
   - Intersection Observer for scroll animations
   - FAQ accordion
   - RSVP form -> mailto builder
   ============================================================ */

(function () {
  'use strict';

  // ----------------------------------------------------------
  // CONFIG
  // ----------------------------------------------------------
  const WEDDING_DATE = new Date('2027-09-25T00:00:00');
  const WEDDING_EMAIL = 'jamie.hannah2027@gmail.com';

  // ----------------------------------------------------------
  // COUNTDOWN TIMER
  // ----------------------------------------------------------
  const countDays = document.getElementById('countDays');
  const countHours = document.getElementById('countHours');
  const countMinutes = document.getElementById('countMinutes');
  const countSeconds = document.getElementById('countSeconds');

  function updateCountdown() {
    const now = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      countDays.textContent = '0';
      countHours.textContent = '0';
      countMinutes.textContent = '0';
      countSeconds.textContent = '0';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    countDays.textContent = days;
    countHours.textContent = hours;
    countMinutes.textContent = minutes;
    countSeconds.textContent = seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ----------------------------------------------------------
  // NAVIGATION — Show/hide on scroll
  // ----------------------------------------------------------
  const siteNav = document.getElementById('siteNav');
  const heroSection = document.getElementById('hero');
  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');
  let lastScrollY = 0;
  let navVisible = false;

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
  }

  function handleNavVisibility() {
    let scrollY = window.scrollY || document.documentElement.scrollTop;
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;

    // Show nav once user scrolls past hero
    if (scrollY > heroBottom * 0.6) {
      if (!navVisible) {
        siteNav.classList.add('visible');
        navVisible = true;
      }
    } else {
      if (navVisible) {
        siteNav.classList.remove('visible');
        navVisible = false;
        closeMobileMenu();
      }
    }

    lastScrollY = scrollY;
  }

  // Throttle scroll events
  let scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      window.requestAnimationFrame(function () {
        handleNavVisibility();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  // ----------------------------------------------------------
  // NAVIGATION — Active section highlighting
  // ----------------------------------------------------------
  const navLinksAll = document.querySelectorAll('[data-nav]');
  const sections = document.querySelectorAll('section[id]');

  const navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinksAll.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px'
  });

  sections.forEach(function (section) {
    navObserver.observe(section);
  });

  // ----------------------------------------------------------
  // NAVIGATION — Smooth scroll on link click
  // ----------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        // Close mobile menu if open
        closeMobileMenu();

        const offset = targetId === 'hero' ? 0 : 60; // Account for fixed nav
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ----------------------------------------------------------
  // MOBILE HAMBURGER MENU
  // ----------------------------------------------------------

  hamburger.addEventListener('click', function () {
    const isOpen = hamburger.classList.contains('open');
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
  });

  // Close mobile menu on clicking outside
  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // ----------------------------------------------------------
  // SCROLL ANIMATIONS — Intersection Observer
  // ----------------------------------------------------------
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade'
  );

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve — we want fade-out too
      } else {
        // Only fade out if element has scrolled above viewport
        const rect = entry.boundingClientRect;
        if (rect.top < 0) {
          entry.target.classList.remove('visible');
        }
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // Stagger children observer
  const staggerElements = document.querySelectorAll('.stagger-children');

  const staggerObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        const rect = entry.boundingClientRect;
        if (rect.top < 0) {
          entry.target.classList.remove('visible');
        }
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  staggerElements.forEach(function (el) {
    staggerObserver.observe(el);
  });

  // ----------------------------------------------------------
  // FAQ ACCORDION
  // ----------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(function (otherItem) {
        otherItem.classList.remove('open');
        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        const answer = otherItem.querySelector('.faq-answer');
        if (answer) answer.setAttribute('aria-hidden', 'true');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
        const answer = item.querySelector('.faq-answer');
        if (answer) answer.setAttribute('aria-hidden', 'false');
      }
    });
  });

  // ----------------------------------------------------------
  // RSVP FORM — Conditional guest count field
  // ----------------------------------------------------------
  const attendingRadios = document.querySelectorAll('input[name="attending"]');
  const guestCountGroup = document.getElementById('guestCountGroup');
  const dietaryGroup = document.getElementById("dietary");

  attendingRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (this.value === 'yes') {
        guestCountGroup.classList.add('visible');
        dietaryGroup.classList.add('visible')
      } else {
        guestCountGroup.classList.remove('visible');
        dietaryGroup.classList.remove('visible');
      }
    });
  });

  // ----------------------------------------------------------
  // RSVP FORM — Build mailto link and open email client
  // ----------------------------------------------------------
  const rsvpForm = document.getElementById('rsvpForm');

  rsvpForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('rsvpName').value.trim();
    const attendingEl = document.querySelector('input[name="attending"]:checked');
    const guests = document.getElementById('rsvpGuests').value;
    const dietary = document.getElementById('rsvpDietary').value.trim();
    const message = document.getElementById('rsvpMessage').value.trim();

    // Basic validation
    if (!name) {
      highlightField('rsvpName');
      return;
    }

    if (!attendingEl) {
      // Flash the radio group
      const radioGroup = document.querySelector('.radio-group');
      radioGroup.style.outline = '2px solid #d4a0a0';
      radioGroup.style.outlineOffset = '4px';
      radioGroup.style.borderRadius = '8px';
      setTimeout(function () {
        radioGroup.style.outline = 'none';
      }, 2000);
      return;
    }

    const attending = attendingEl.value;
    const attendingText = attending === 'yes' ? 'Joyfully Accepts' : 'Regretfully Declines';

    // Build email body
    const subject = 'RSVP - ' + name;
    let body = 'Wedding RSVP for Jamie & Hannah\n';
    body += '================================\n\n';
    body += 'Name: ' + name + '\n';
    body += 'Attending: ' + attendingText + '\n';

    if (attending === 'yes') {
      body += 'Number of Guests: ' + guests + '\n';
    }

    if (dietary) {
      body += 'Dietary Restrictions: ' + dietary + '\n';
    }

    if (message) {
      body += '\nMessage:\n' + message + '\n';
    }

    body += '\n================================\n';
    body += 'Sent from the wedding website';

    // Build mailto URL (email address should not be percent-encoded)
    // Open email client
    window.location.href = 'mailto:' + WEDDING_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  });

  function highlightField(id) {
    const field = document.getElementById(id);
    field.style.borderColor = '#d4a0a0';
    field.style.boxShadow = '0 0 0 3px rgba(212, 160, 160, 0.2)';
    field.focus();
    setTimeout(function () {
      field.style.borderColor = '';
      field.style.boxShadow = '';
    }, 2000);
  }

  // ----------------------------------------------------------
  // PARALLAX — Subtle movement of hero blobs on scroll
  // ----------------------------------------------------------
  const heroBlobs = document.querySelectorAll('.hero-bg .wc-blob');
  let parallaxTicking = false;

  window.addEventListener('scroll', function () {
    if (!parallaxTicking) {
      window.requestAnimationFrame(function () {
        let scrollY = window.scrollY;
        // Only apply when hero is in or near viewport
        if (scrollY < window.innerHeight * 1.5) {
          heroBlobs.forEach(function (blob, index) {
            const speed = 0.02 + (index * 0.01);
            const yOffset = scrollY * speed;
            blob.style.transform = 'translateY(' + yOffset + 'px)';
          });
        }
        parallaxTicking = false;
      });
      parallaxTicking = true;
    }
  });

})();
