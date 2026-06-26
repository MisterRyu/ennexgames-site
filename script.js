const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
const navLinks = siteNav?.querySelectorAll('a') ?? [];
const spotlightLinks = Array.from(document.querySelectorAll('.spotlight-link'));
const sceneDots = Array.from(document.querySelectorAll('.scene-dot'));
const sceneStrip = document.querySelector('.scene-strip');
const prevButton = document.querySelector('.scene-arrow--prev');
const nextButton = document.querySelector('.scene-arrow--next');
const scenes = Array.from(document.querySelectorAll('.scene'));

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (siteNav.classList.contains('open')) {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

function setActiveScene(index) {
  const normalized = ((index % scenes.length) + scenes.length) % scenes.length;
  sceneDots.forEach((dot) => dot.classList.toggle('active', Number(dot.dataset.scene) === normalized));
  spotlightLinks.forEach((button) => button.classList.toggle('active', Number(button.dataset.scene) === normalized));
  spotlightLinks.forEach((button) => button.setAttribute('aria-pressed', Number(button.dataset.scene) === normalized ? 'true' : 'false'));
}

function goToScene(index) {
  const normalized = ((index % scenes.length) + scenes.length) % scenes.length;
  const target = scenes[normalized];
  if (!target || !sceneStrip) return;
  target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  setActiveScene(normalized);
}

spotlightLinks.forEach((button) => {
  button.addEventListener('click', () => {
    const index = Number(button.dataset.scene);
    goToScene(index);
  });
});

sceneDots.forEach((button) => {
  button.addEventListener('click', () => {
    const index = Number(button.dataset.scene);
    goToScene(index);
  });
});

prevButton?.addEventListener('click', () => {
  const current = sceneDots.findIndex((dot) => dot.classList.contains('active'));
  goToScene(current - 1);
});

nextButton?.addEventListener('click', () => {
  const current = sceneDots.findIndex((dot) => dot.classList.contains('active'));
  goToScene(current + 1);
});

let scrollTimeout = null;

sceneStrip?.addEventListener('scroll', () => {
  if (!sceneStrip) return;
  if (scrollTimeout) {
    window.clearTimeout(scrollTimeout);
  }
  scrollTimeout = window.setTimeout(() => {
    const center = sceneStrip.scrollLeft + sceneStrip.clientWidth / 2;
    let closestIndex = 0;
    let smallestDistance = Infinity;

    scenes.forEach((scene, index) => {
      const rect = scene.getBoundingClientRect();
      const sceneLeft = scene.offsetLeft;
      const sceneCenter = sceneLeft + rect.width / 2;
      const distance = Math.abs(center - sceneCenter);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveScene(closestIndex);
  }, 80);
});

if (scenes.length > 0) {
  setActiveScene(0);
}
