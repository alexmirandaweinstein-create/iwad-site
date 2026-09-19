const toggles = document.querySelectorAll('.reveal-toggle');
const form = document.querySelector('#signup-form');
const message = document.querySelector('#form-message');
const night = document.querySelector('.night');
const main = document.querySelector('main');
const footer = document.querySelector('footer');
let audioContext;

// Paste the Google Apps Script web-app URL here after deploying it.
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzo-ksIRzlPxk905dmoDHttrTzntM0tPeDsrStWBlD2_JCNG9SBwK4Y-vIgxlm4_vAMLw/exec';

const sizeNightToStory = () => {
  const storyHeight = main.getBoundingClientRect().height + footer.getBoundingClientRect().height;
  night.style.height = `${Math.max(window.innerHeight, storyHeight)}px`;
};

new ResizeObserver(sizeNightToStory).observe(main);
window.addEventListener('resize', sizeNightToStory);
sizeNightToStory();

const playPaperCrumple = () => {
  audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
  const now = audioContext.currentTime;
  const duration = 0.38;
  const buffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
  const samples = buffer.getChannelData(0);

  for (let i = 0; i < samples.length; i += 1) {
    const progress = i / samples.length;
    const crackle = Math.random() > 0.965 ? (Math.random() * 2 - 1) * 1.8 : 0;
    const rustle = (Math.random() * 2 - 1) * (1 - progress) ** 1.6;
    samples[i] = (rustle + crackle) * 0.34;
  }

  const source = audioContext.createBufferSource();
  const highpass = audioContext.createBiquadFilter();
  const lowpass = audioContext.createBiquadFilter();
  const gain = audioContext.createGain();

  source.buffer = buffer;
  highpass.type = 'highpass';
  highpass.frequency.setValueAtTime(650, now);
  lowpass.type = 'lowpass';
  lowpass.frequency.setValueAtTime(5200, now);
  lowpass.frequency.exponentialRampToValueAtTime(1700, now + duration);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.16, now + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  source.connect(highpass).connect(lowpass).connect(gain).connect(audioContext.destination);
  source.start(now);
  source.stop(now + duration);
};

toggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    playPaperCrumple();
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
