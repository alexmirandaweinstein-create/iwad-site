const toggle = document.querySelector('.about-toggle');
const about = document.querySelector('#about-novel');
const form = document.querySelector('#signup-form');
const message = document.querySelector('#form-message');
const night = document.querySelector('.night');
const main = document.querySelector('main');
const footer = document.querySelector('footer');

const sizeNightToStory = () => {
  const storyHeight = main.getBoundingClientRect().height + footer.getBoundingClientRect().height;
  night.style.height = `${Math.max(window.innerHeight, storyHeight)}px`;
};

new ResizeObserver(sizeNightToStory).observe(main);
window.addEventListener('resize', sizeNightToStory);
sizeNightToStory();

toggle.addEventListener('click', () => {
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!isOpen));
  about.setAttribute('aria-hidden', String(isOpen));
});

form.addEventListener('submit', (event) => {
  const email = form.elements.email_address;

  if (!email.checkValidity()) {
    event.preventDefault();
    message.textContent = 'Please enter a valid email address.';
    email.focus();
    return;
  }

  message.textContent = 'Sending…';
});
