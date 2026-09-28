// ==================== Тема ====================

const themeToggle = document.querySelector('.header__theme-toggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
  document.body.classList.add('dark');
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
});

// ==================== Бургер-меню ====================
const header = document.querySelector('.header');
const headerNav = document.querySelector('.header__nav-container');
const navItems = headerNav.querySelectorAll('a');
const burger = document.getElementById('burger');
const body = document.body;
const headerMenuButton = document.querySelector('.header__link-menu');
const headerLogoLink = document.querySelector('.header__logo');

burger.addEventListener('click', () => {
  header.classList.toggle('active');
  body.classList.toggle('stop-scroll');
});

navItems.forEach(el => {
  el.addEventListener('click', () => {
    header.classList.remove('active');
    body.classList.remove('stop-scroll');
  });
});

if (headerMenuButton) {
  headerMenuButton.addEventListener('click', () => {
    header.classList.remove('active');
    body.classList.remove('stop-scroll');
  });
}

headerLogoLink.addEventListener('click', () => {
  header.classList.remove('active');
});

// Escape закрывает бургер
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && header.classList.contains('active')) {
    header.classList.remove('active');
    body.classList.remove('stop-scroll');
  }
});

// ==================== Данные каталога ====================
let allProducts = [];
let currentProduct = null;

const menuCards = document.querySelectorAll('.menu__cards');
const buttons = document.querySelectorAll('.menu__button');
const buttonImg = document.querySelectorAll('.button__img');
const buttonRefresh = document.querySelector('.menu__button-refresh');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('close-modal-btn');
const priceEl = document.querySelector('.modal-drinks__price');

function createCard(product) {
  const wrapper = document.createElement('div');
  wrapper.className = 'menu__card-wrapper';
  wrapper.innerHTML = `
    <div class="menu__card">
      <div class="menu__card-picture">
        <img src="../assets/img/${product.image}" alt="${product.name}" class="menu__card-img">
      </div>
      <div class="menu__card-content">
        <h3 class="menu__card-title">${product.name}</h3>
        <div class="menu__card-text">${product.description}</div>
        <div class="menu__card-price">$${product.price}</div>
      </div>
    </div>
  `;
  wrapper.querySelector('.menu__card').addEventListener('click', () => openModal(product));
  return wrapper;
}

function renderCards(products, container) {
  container.innerHTML = '';
  products.forEach(product => container.appendChild(createCard(product)));

  // Скрываем с 5-й карточки
  const wrappers = container.querySelectorAll('.menu__card-wrapper');
  wrappers.forEach((w, i) => {
    if (i >= 4) w.classList.add('card-wrapper__hidden');
  });

  return wrappers.length > 4; // есть ли скрытые
}

async function loadProducts() {
  try {
    const res = await fetch('../assets/products.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    allProducts = await res.json();

    const byCategory = {
      coffee: allProducts.filter(p => p.category === 'coffee'),
      tea: allProducts.filter(p => p.category === 'tea'),
      dessert: allProducts.filter(p => p.category === 'dessert'),
    };

    menuCards.forEach(container => {
      const key = container.dataset.category;
      const hasHidden = renderCards(byCategory[key], container);

      if (container.classList.contains('menu__cards_active')) {
        buttonRefresh.classList.toggle('button-refresh__invisible', !hasHidden);
      }
    });
  } catch (err) {
    console.error('Не удалось загрузить products.json:', err);
  }
}

loadProducts();

// ==================== Переключение категорий ====================
buttons.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    buttons.forEach(el => el.classList.remove('menu__button_active'));
    btn.classList.add('menu__button_active');

    buttonImg.forEach(el => el.classList.remove('button__img_active'));
    buttonImg[i].classList.add('button__img_active');

    menuCards.forEach(cards => {
      cards.classList.remove('menu__cards_active');
      cards.classList.add('fadein');
    });
    menuCards[i].classList.add('menu__cards_active');

    // Сброс скрытых карточек в активной категории
    const activeContainer = menuCards[i];
    activeContainer.querySelectorAll('.menu__card-wrapper').forEach((w, idx) => {
      if (idx >= 4) w.classList.add('card-wrapper__hidden');
    });

    // Показать/скрыть кнопку refresh
    const hasHidden = activeContainer.querySelectorAll('.card-wrapper__hidden').length > 0;
    buttonRefresh.classList.toggle('button-refresh__invisible', !hasHidden);
  });
});

// ==================== Кнопка «показать ещё» ====================
buttonRefresh.addEventListener('click', () => {
  const activeContainer = document.querySelector('.menu__cards_active');
  activeContainer.querySelectorAll('.card-wrapper__hidden').forEach(item => {
    item.classList.remove('card-wrapper__hidden');
    item.classList.add('fadein');
  });
  buttonRefresh.classList.add('button-refresh__invisible');
});

// ==================== Модальное окно ====================
function openModal(product) {
  currentProduct = product;

  document.querySelector('.modal-drinks__title').textContent = product.name;
  document.querySelector('.modal-drinks__text').textContent = product.description;
  document.querySelector('.modal-drinks__pic').src = `../assets/img/${product.image}`;
  document.querySelector('.modal-drinks__pic').alt = product.name;

  document.querySelector('.size-s').textContent = product.sizes.s.size;
  document.querySelector('.size-m').textContent = product.sizes.m.size;
  document.querySelector('.size-l').textContent = product.sizes.l.size;

  const additivesEls = document.querySelectorAll('.additives');
  additivesEls.forEach((el, i) => {
    if (product.additives[i]) el.textContent = product.additives[i].name;
  });

  // Сброс параметров: активен только размер S
  document.querySelectorAll('.tabs__button').forEach(b => b.classList.remove('tabs__button_active'));
  document.querySelector('.tabs__button-size').classList.add('tabs__button_active');
  priceEl.textContent = product.price;

  modal.classList.add('visible');
  body.classList.add('stop-scroll');
}

function closeModal() {
  modal.classList.remove('visible');
  body.classList.remove('stop-scroll');
}

closeBtn.addEventListener('click', closeModal);

modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});

// Escape закрывает модалку
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('visible')) {
    closeModal();
  }
});

// ==================== Параметры карточки ====================
document.querySelector('.modal-drinks').addEventListener('click', e => {
  const btn = e.target.closest('.tabs__button');
  if (!btn || !currentProduct) return;

  if (btn.classList.contains('tabs__button-size')) {
    // размер — одиночный выбор
    document.querySelectorAll('.tabs__button-size').forEach(b => b.classList.remove('tabs__button_active'));
    btn.classList.add('tabs__button_active');
  } else if (btn.classList.contains('tabs__button-additive')) {
    // добавки — мультивыбор
    btn.classList.toggle('tabs__button_active');
  }

  recalcPrice();
});

function recalcPrice() {
  if (!currentProduct) return;

  let total = Number(currentProduct.price);

  const activeSize = document.querySelector('.tabs__button-size.tabs__button_active');
  if (activeSize) {
    const sizeKey = activeSize.dataset.size; // "s" | "m" | "l"
    total += Number(currentProduct.sizes[sizeKey]['add-price']);
  }

  const activeAdditives = document.querySelectorAll('.tabs__button-additive.tabs__button_active');
  activeAdditives.forEach(btn => {
    const idx = Number(btn.dataset.additive);
    total += Number(currentProduct.additives[idx]['add-price']);
  });

  priceEl.textContent = total.toFixed(2);
}
