/* ============================================================
   SHARED.JS — Common wedding-site behavior
   ============================================================ */

(function () {
  'use strict';

  const WEDDING_DATE = new Date('2027-09-25T00:00:00');
  const WEDDING_EMAIL = 'jamie.hannah2027@gmail.com';

  function closeMobileMenu(hamburger, navLinks) {
    if (!hamburger || !navLinks) {
      return;
    }

    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
  }

  function initNavigation() {
    const siteNav = document.getElementById('siteNav');
    const heroSection = document.getElementById('hero');
    const hamburger = document.getElementById('navHamburger');
    const navLinks = document.getElementById('navLinks');
    const navLinksAll = document.querySelectorAll('[data-nav]');

    if (!siteNav) {
      return;
    }

    function getCurrentPageName() {
      return window.location.pathname.split('/').pop() || 'index.html';
    }

    function setActiveNavLink() {
      const currentPage = getCurrentPageName();

      navLinksAll.forEach(function (link) {
        const linkPage = new URL(link.getAttribute('href'), window.location.href).pathname.split('/').pop() || 'index.html';
        link.classList.toggle('active', linkPage === currentPage);
      });
    }

    function handleNavVisibility() {
      if (!heroSection) {
        siteNav.classList.add('visible');
        return;
      }

      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;

      if (scrollY > heroBottom * 0.6) {
        siteNav.classList.add('visible');
      } else {
        siteNav.classList.remove('visible');
        closeMobileMenu(hamburger, navLinks);
      }
    }

   // handleNavVisibility();
    setActiveNavLink();

    if (hamburger && navLinks) {
      hamburger.addEventListener('click', function () {
        const isOpen = hamburger.classList.contains('open');
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      });

      document.addEventListener('click', function (e) {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
          closeMobileMenu(hamburger, navLinks);
        }
      });
    }

    navLinksAll.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileMenu(hamburger, navLinks);
      });
    });

    let scrollTicking = false;
    window.addEventListener('scroll', function () {
      if (!scrollTicking) {
        window.requestAnimationFrame(function () {
          //handleNavVisibility();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    });
  }

  function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade');
    const staggerElements = document.querySelectorAll('.stagger-children');

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(function (el) {
        el.classList.add('visible');
      });

      staggerElements.forEach(function (el) {
        el.classList.add('visible');
      });

      return;
    }

    if (revealElements.length) {
      const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else if (entry.boundingClientRect.top < 0) {
            entry.target.classList.remove('visible');
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      });

      revealElements.forEach(function (el) {
        revealObserver.observe(el);
      });
    }

    if (staggerElements.length) {
      const staggerObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else if (entry.boundingClientRect.top < 0) {
            entry.target.classList.remove('visible');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
      });

      staggerElements.forEach(function (el) {
        staggerObserver.observe(el);
      });
    }
  }

  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
      const question = item.querySelector('.faq-question');

      if (!question) {
        return;
      }

      question.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');

        faqItems.forEach(function (otherItem) {
          otherItem.classList.remove('open');

          const otherQuestion = otherItem.querySelector('.faq-question');
          if (otherQuestion) {
            otherQuestion.setAttribute('aria-expanded', 'false');
          }

          const answer = otherItem.querySelector('.faq-answer');
          if (answer) {
            answer.setAttribute('aria-hidden', 'true');
          }
        });

        if (!isOpen) {
          item.classList.add('open');
          question.setAttribute('aria-expanded', 'true');

          const answer = item.querySelector('.faq-answer');
          if (answer) {
            answer.setAttribute('aria-hidden', 'false');
          }
        }
      });
    });
  }

  function initRsvpForm() {
    const attendingRadios = document.querySelectorAll('input[name="attending"]');
    const guestCountGroup = document.getElementById('guestCountGroup');
    const dietaryGroup = document.getElementById('dietary');
    const rsvpForm = document.getElementById('rsvpForm');

    if (attendingRadios.length && guestCountGroup && dietaryGroup) {
      attendingRadios.forEach(function (radio) {
        radio.addEventListener('change', function () {
          if (this.value === 'yes') {
            guestCountGroup.classList.add('visible');
            dietaryGroup.classList.add('visible');
          } else {
            guestCountGroup.classList.remove('visible');
            dietaryGroup.classList.remove('visible');
          }
        });
      });
    }

    if (!rsvpForm) {
      return;
    }

    function highlightField(id) {
      const field = document.getElementById(id);

      if (!field) {
        return;
      }

      field.style.borderColor = '#d4a0a0';
      field.style.boxShadow = '0 0 0 3px rgba(212, 160, 160, 0.2)';
      field.focus();

      setTimeout(function () {
        field.style.borderColor = '';
        field.style.boxShadow = '';
      }, 2000);
    }

    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameField = document.getElementById('rsvpName');
      const guestsField = document.getElementById('rsvpGuests');
      const dietaryField = document.getElementById('rsvpDietary');
      const messageField = document.getElementById('rsvpMessage');
      const attendingEl = document.querySelector('input[name="attending"]:checked');

      if (!nameField || !guestsField || !dietaryField || !messageField) {
        return;
      }

      const name = nameField.value.trim();
      const guests = guestsField.value;
      const dietary = dietaryField.value.trim();
      const message = messageField.value.trim();

      if (!name) {
        highlightField('rsvpName');
        return;
      }

      if (!attendingEl) {
        const radioGroup = document.querySelector('.radio-group');
        if (radioGroup) {
          radioGroup.style.outline = '2px solid #d4a0a0';
          radioGroup.style.outlineOffset = '4px';
          radioGroup.style.borderRadius = '8px';
          setTimeout(function () {
            radioGroup.style.outline = 'none';
          }, 2000);
        }
        return;
      }

      const attending = attendingEl.value;
      const attendingText = attending === 'yes' ? 'Joyfully Accepts' : 'Regretfully Declines';
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

      window.location.href = 'mailto:' + WEDDING_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    });
  }

  function initShared() {
    initNavigation();
    initRevealAnimations();
    initFaqAccordion();
    initRsvpForm();
  }

  window.WeddingSite = {
    initShared: initShared,
    initNavigation: initNavigation,
    initRevealAnimations: initRevealAnimations,
    initFaqAccordion: initFaqAccordion,
    initRsvpForm: initRsvpForm,
    WEDDING_DATE: WEDDING_DATE
  };
})();
