/* ============================================================
   HOME.JS — Homepage behavior
   ============================================================ */

(function () {
  'use strict';

  function initCountdown() {
    const countDays = document.getElementById('countDays');
    const countHours = document.getElementById('countHours');
    const countMinutes = document.getElementById('countMinutes');
    const countSeconds = document.getElementById('countSeconds');
    const weddingDate = window.WeddingSite && window.WeddingSite.WEDDING_DATE
      ? window.WeddingSite.WEDDING_DATE
      : new Date('2027-09-25T00:00:00');

    if (!countDays || !countHours || !countMinutes || !countSeconds) {
      return;
    }

    function updateCountdown() {
      const now = new Date();
      const diff = weddingDate - now;

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
  }

  function initHeroParallax() {
    const heroSection = document.getElementById('hero');
    const heroBlobs = document.querySelectorAll('.hero-bg .wc-blob');

    if (!heroSection || !heroBlobs.length) {
      return;
    }

    let parallaxTicking = false;

    window.addEventListener('scroll', function () {
      if (!parallaxTicking) {
        window.requestAnimationFrame(function () {
          const scrollY = window.scrollY;

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
  }

  if (window.WeddingSite) {
    window.WeddingSite.initShared();
  }

  initCountdown();
  initHeroParallax();
})();
