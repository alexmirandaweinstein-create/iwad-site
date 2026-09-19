const toggles = document.querySelectorAll('.reveal-toggle');
const form = document.querySelector('#signup-form');
const message = document.querySelector('#form-message');
const night = document.querySelector('.night');
const main = document.querySelector('main');
const footer = document.querySelector('footer');

// Paste the Google Apps Script web-app URL here after deploying it.
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzo-ksIRzlPxk905dmoDHttrTzntM0tPeDsrStWBlD2_JCNG9SBwK4Y-vIgxlm4_vAMLw/exec';

const sizeNightToStory = () => {
  const storyHeight = main.getBoundingClientRect().height + footer.getBoundingClientRect().height;
  night.style.height = `${Math.max(window.innerHeight, storyHeight)}px`;
};

new ResizeObserver(sizeNightToStory).observe(main);
window.addEventListener('resize', sizeNightToStory);
sizeNightToStory();

toggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';

    toggles.forEach((otherToggle) => {
      const panel = document.querySelector(`#${otherToggle.getAttribute('aria-controls')}`);
      const shouldOpen = otherToggle === toggle && !isOpen;
      otherToggle.setAttribute('aria-expanded', String(shouldOpen));
      panel.setAttribute('aria-hidden', String(!shouldOpen));
    });
  });
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = form.elements.email;

  if (!email.checkValidity()) {
    message.textContent = 'Please enter a valid email address.';
    email.focus();
    return;
  }

  if (!GOOGLE_SCRIPT_URL) {
    message.textContent = 'The signup list is being connected. Please check back soon.';
    return;
  }

  form.dataset.active = 'true';
  message.textContent = 'Sending…';

  try {
    const body = new URLSearchParams({
      email: email.value.trim(),
      source: window.location.href,
    });

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body,
    });

    form.reset();
    message.textContent = 'You’re on the list. Thank you.';
  } catch {
    message.textContent = 'Something went wrong. Please try again.';
  } finally {
    delete form.dataset.active;
  }
});
