'use strict';
const toggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('navigation');
function closeMenu(returnFocus = false) {
  menu.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', '打开菜单');
  if (returnFocus) toggle.focus();
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  menu.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
});
menu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', event => { if (!event.target.closest('.navbar')) closeMenu(); });
matchMedia('(min-width: 761px)').addEventListener('change', event => { if(event.matches) closeMenu(); });
const links = [...menu.querySelectorAll('a')];
const sections = [...document.querySelectorAll('main > section[id]')];
let queued = false;
function markCurrent() {
  queued = false;
  const current = [...sections].reverse().find(section => section.getBoundingClientRect().top <= 150) || sections[0];
  for (const link of links) {
    if (link.hash === '#' + current.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(markCurrent); } }, {passive: true});
addEventListener('resize', markCurrent);
markCurrent();
document.getElementById('year').textContent = new Date().getFullYear();
document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const status = document.getElementById('copy-status');
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      status.textContent = '已复制：' + button.dataset.copy;
      button.textContent = '已复制';
    } catch {
      status.textContent = '请手动复制：' + button.dataset.copy;
      status.tabIndex = -1;
      status.focus();
    }
  });
});
