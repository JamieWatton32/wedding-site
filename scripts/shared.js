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
  const faqItems = document.querySelectorAll('.centered-list-item');
  const COLLAPSE_FALLBACK_MS = 300; // fallback if no transition is detected

  function closeItem(item) {
    const question = item.querySelector('.centered-list-button');
    const answer = item.querySelector('.list-answer');

    item.classList.remove('open');
    if (question) question.setAttribute('aria-expanded', 'false');
    if (answer) answer.setAttribute('aria-hidden', 'true');
  }

  function openItem(item) {
    const question = item.querySelector('.centered-list-button');
    const answer = item.querySelector('.list-answer');

    item.classList.add('open');
    if (question) question.setAttribute('aria-expanded', 'true');
    if (answer) answer.setAttribute('aria-hidden', 'false');
  }

  faqItems.forEach(function (item) {
    const question = item.querySelector('.centered-list-button');
    if (!question) return;

    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');
      const currentlyOpenItem = Array.from(faqItems).find(function (i) {
        return i !== item && i.classList.contains('open');
      });

      // Clicking the already-open item: just close it
      if (isOpen) {
        closeItem(item);
        return;
      }

      // No other item open: just open this one
      if (!currentlyOpenItem) {
        openItem(item);
        return;
      }

      // Another item is open: close it first, then open the new one
      // once its collapse transition finishes
      const answerToClose = currentlyOpenItem.querySelector('.list-answer');

      let opened = false;
      function handleTransitionEnd(e) {
        // Ignore bubbled transitions from children
        if (e.target !== answerToClose) return;
        finishAndOpen();
      }

      function finishAndOpen() {
        if (opened) return;
        opened = true;
        if (answerToClose) {
          answerToClose.removeEventListener('transitionend', handleTransitionEnd);
        }
        openItem(item);
      }

      closeItem(currentlyOpenItem);

      if (answerToClose) {
        answerToClose.addEventListener('transitionend', handleTransitionEnd);
        // Fallback in case there's no CSS transition defined
        setTimeout(finishAndOpen, COLLAPSE_FALLBACK_MS);
      } else {
        openItem(item);
      }
    });
  });
}

  function initRsvpForm() {
    const attendingRadios = document.querySelectorAll('input[name="attending"]');
    const guestCountGroup = document.getElementById('guestCountGroup');
    const dietaryGroup = document.getElementById('dietary');
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpStatus = document.getElementById('rsvpStatus');

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

    function showStatus(message, state) {
      if (!rsvpStatus) {
        return;
      }

      rsvpStatus.textContent = message;
      rsvpStatus.classList.remove('success', 'error');

      if (state) {
        rsvpStatus.classList.add(state);
      }

      rsvpStatus.classList.add('visible');
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
        showStatus('Please enter your name before sending the RSVP.', 'error');
        highlightField('rsvpName');
        return;
      }

      if (!attendingEl) {
        showStatus('Please choose whether you are attending before sending the RSVP.', 'error');
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

      const mailtoUrl = 'mailto:' + WEDDING_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      const mailWindow = window.open(mailtoUrl, '_blank');

      if (mailWindow) {
        showStatus('Your mail window opened. Send the email from your mail app to finish the RSVP.', 'success');
      } else {
        window.location.href = mailtoUrl;
        showStatus('Your browser blocked the popup. Please allow popups or check your mail app.', 'error');
      }
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
