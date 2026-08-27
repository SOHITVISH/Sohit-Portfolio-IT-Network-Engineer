const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.desktop-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('mobile-open', !isOpen);
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('mobile-open');
  });
});

const progress = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
}, { passive: true });

document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.project-card').forEach((card) => {
      card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

const consoleMessages = {
  uptime: '> uptime: 99%+ | environment: mission-critical | status: nominal',
  stack: '> stack: Cisco · Sophos · Ruckus · Python · Zabbix · AWS',
  approach: '> approach: detect → isolate → analyze → resolve → prevent'
};
document.querySelectorAll('.console-actions button').forEach((button) => {
  button.addEventListener('click', () => {
    const output = document.querySelector('.console-output');
    if (output) output.textContent = consoleMessages[button.dataset.command];
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const gameNodes = [...document.querySelectorAll('.game-node')];
const gameProgress = document.querySelector('#game-progress');
const gameStatus = document.querySelector('#game-status');
const gameMessage = document.querySelector('#game-message');
const resetGame = () => {
  gameNodes.forEach((node) => node.classList.remove('visited', 'wrong', 'complete'));
  if (gameProgress) gameProgress.textContent = '0 / 4';
  if (gameStatus) gameStatus.textContent = 'AWAITING ROUTE';
  if (gameMessage) gameMessage.textContent = 'Click CLIENT to begin the route.';
};
let nextHop = 0;
gameNodes.forEach((node) => {
  node.addEventListener('click', () => {
    const hop = Number(node.dataset.hop);
    if (hop !== nextHop) {
      node.classList.remove('wrong');
      void node.offsetWidth;
      node.classList.add('wrong');
      if (gameStatus) gameStatus.textContent = 'ROUTE BLOCKED';
      if (gameMessage) gameMessage.textContent = 'Wrong hop. Check the path and try again.';
      return;
    }
    node.classList.add('visited');
    nextHop += 1;
    if (gameProgress) gameProgress.textContent = `${Math.min(nextHop - 1, 4)} / 4`;
    if (nextHop === gameNodes.length) {
      gameNodes.forEach((item) => item.classList.add('complete'));
      if (gameStatus) gameStatus.textContent = 'PACKET DELIVERED';
      if (gameMessage) gameMessage.textContent = 'Success — the packet reached the server.';
    } else {
      if (gameStatus) gameStatus.textContent = 'PATH VALID';
      if (gameMessage) gameMessage.textContent = `Hop ${nextHop} accepted. Continue routing.`;
    }
  });
});
document.querySelector('#game-reset')?.addEventListener('click', () => {
  nextHop = 0;
  resetGame();
});
