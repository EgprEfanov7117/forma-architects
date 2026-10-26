'use strict';

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
const desktopBreakpoint = window.matchMedia('(min-width: 701px)');
let activeDialog = null;

function setMenu(open, returnFocus = false) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  mobileMenu.hidden = !open;
  document.querySelectorAll('main, footer, .header > .logo, .header-contact, .desktop-nav').forEach(element => {
    element.inert = open;
  });
  document.body.classList.toggle('is-locked', open || Boolean(activeDialog));
  if (open) mobileMenu.querySelector('a').focus();
  else if (returnFocus) menuToggle.focus();
}

menuToggle.addEventListener('click', () => setMenu(mobileMenu.hidden));
mobileMenu.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
desktopBreakpoint.addEventListener('change', event => {
  if (event.matches) setMenu(false);
});

document.addEventListener('keydown', event => {
  if (mobileMenu.hidden) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    setMenu(false, true);
  }
  if (event.key === 'Tab') {
    const links = [...mobileMenu.querySelectorAll('a')];
    const first = links[0];
    const last = links[links.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); menuToggle.focus();
    } else if (event.shiftKey && document.activeElement === menuToggle) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); menuToggle.focus();
    } else if (!event.shiftKey && document.activeElement === menuToggle) {
      event.preventDefault(); first.focus();
    }
  }
});

// Keep keyboard focus aligned with same-page navigation.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    if (activeDialog) activeDialog.close();
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
});

const projects = {
  villa: { title: 'VILLA NORTH', image: 'villa-north', category: 'Загородная резиденция', year: '2026', description: 'Дом, который раскрывается навстречу пейзажу. Концепция строится на горизонтальных объёмах, глубокой тени террас и отражениях воды. Общая зона продолжает сад, а приватные комнаты сохраняют ощущение уединения.', material: 'Камень, дерево, стекло', idea: 'Жизнь в диалоге с природой' },
  mono: { title: 'MONO HOUSE', image: 'mono-house', category: 'Частный дом', year: '2026', description: 'Один объём — множество сценариев жизни. Исследование сдержанной архитектуры, где характер определяют пропорции и ритм окон. Лаконичная внешняя оболочка становится фоном для тёплой, личной среды внутри.', material: 'Светлая штукатурка, металл', idea: 'Выразительность простоты' },
  atelier: { title: 'ATELIER 08', image: 'atelier-08', category: 'Коммерческое пространство', year: '2025', description: 'Ателье, галерея, место для разговора. Открытая планировка позволяет менять сценарий пространства, а нейтральные поверхности оставляют главную роль людям и предметам. Свет становится самостоятельным архитектурным материалом.', material: 'Бетон, белые поверхности', idea: 'Свобода наполнять смыслом' },
  silence: { title: 'SILENCE RESIDENCE', image: 'silence-residence', category: 'Жилой интерьер', year: '2025', description: 'Интерьер как тихое продолжение своего владельца. Натуральные фактуры и мягкая палитра соединяют отдельные зоны в спокойную, цельную среду. Здесь важны утренний свет, удобное кресло и вещи, к которым приятно прикоснуться.', material: 'Дерево, лён, тёплые оттенки', idea: 'Личный ритм и тишина' }
};

function openDialog(dialog) {
  if (!mobileMenu.hidden) setMenu(false);
  activeDialog = dialog;
  document.body.classList.add('is-locked');
  dialog.showModal();
}

document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('close', () => {
    activeDialog = null;
    document.body.classList.toggle('is-locked', !mobileMenu.hidden);
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
});

const projectDialog = document.querySelector('.project-dialog');
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    document.querySelector('#dialog-title').textContent = project.title;
    document.querySelector('#dialog-meta').textContent = `Концепт / ${project.year} / ${project.category}`;
    document.querySelector('#dialog-description').textContent = project.description;
    const image = button.querySelector('img').cloneNode();
    image.removeAttribute('srcset');
    image.removeAttribute('sizes');
    image.src = `assets/images/${project.image}-1200.webp`;
    image.loading = 'eager';
    document.querySelector('.dialog-image').replaceChildren(image);
    const facts = [['Тип', project.category], ['Материалы концепции', project.material], ['Идея', project.idea]];
    const factNodes = facts.map(([label, value]) => {
      const row = document.createElement('div');
      const term = document.createElement('dt');
      const description = document.createElement('dd');
      term.textContent = label; description.textContent = value;
      row.append(term, description); return row;
    });
    document.querySelector('.dialog-facts').replaceChildren(...factNodes);
    openDialog(projectDialog);
    projectDialog.scrollTop = 0;
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => projectDialog.close());

const demoDialog = document.querySelector('.demo-dialog');
document.querySelector('[data-contact-demo]').addEventListener('click', () => {
  document.querySelector('#demo-description').textContent = 'FORMA ARCHITECTS — вымышленная студия, созданная для портфолио NOVARY. hello@forma.example — демонстрационный адрес на зарезервированном домене .example. Заявки здесь не отправляются.';
  openDialog(demoDialog);
});
document.querySelectorAll('[data-social]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('#demo-description').textContent = `Профиль FORMA ARCHITECTS в ${button.dataset.social} показан как часть концепции. Реального аккаунта студии нет. Этот сайт — демонстрационный проект NOVARY.`;
    openDialog(demoDialog);
  });
});
document.querySelectorAll('.demo-close, .demo-dismiss').forEach(button => button.addEventListener('click', () => demoDialog.close()));

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !motionPreference.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07 });
  document.documentElement.classList.add('has-js');
  document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
  motionPreference.addEventListener('change', event => {
    if (event.matches) {
      observer.disconnect();
      document.documentElement.classList.remove('has-js');
    }
  });
}
