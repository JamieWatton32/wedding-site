/* ============================================================
   RSVP.JS — RSVP page entrypoint
   ============================================================ */

(function () {
  'use strict';

  // Flip to true when you're ready to accept RSVP submissions.
  const RSVP_OVERRIDE_ENABLED = false;

  function setFormEnabled(form, enabled) {
    const controls = form.querySelectorAll('input, textarea, select, button');
    controls.forEach((control) => {
      control.disabled = !enabled;
    });
  }

  function initRsvpGate() {
    const form = document.getElementById('rsvpForm');
    const unavailableMessage = document.getElementById('rsvpUnavailable');

    if (!form) {
      return;
    }

    if (RSVP_OVERRIDE_ENABLED) {
      setFormEnabled(form, true);

      if (unavailableMessage) {
        unavailableMessage.hidden = true;
      }
    } else {
      form.remove();
      if (unavailableMessage) {
        unavailableMessage.hidden = false;
      }
    }

    form.addEventListener('submit', function (event) {
      if (!RSVP_OVERRIDE_ENABLED) {
        event.preventDefault();
      }
    });
  }

  if (window.WeddingSite) {
    window.WeddingSite.initShared();
  }

  initRsvpGate();
})();
