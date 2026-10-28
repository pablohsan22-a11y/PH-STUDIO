'use strict';
const negocio = window.NEGOCIO;
const setText = (id, value) => { document.getElementById(id).textContent = value; };
document.title = negocio.nombre + ' | Cafetería';
document.querySelector('meta[name="description"]').content = negocio.descripcion;
document.querySelectorAll('[data-name]').forEach(element => { element.textContent = negocio.nombre; });
if (/^#[0-9a-f]{6}$/i.test(negocio.color)) document.documentElement.style.setProperty('--accent', negocio.color);
for (const [id, value] of Object.entries({ category: negocio.categoria, headline: negocio.titular, description: negocio.descripcion, promise: negocio.promesa, about: negocio.nosotros, location: negocio.ubicacion, hours: negocio.horario, year: new Date().getFullYear() })) setText(id, value);
negocio.servicios.forEach((service, index) => {
  const card = document.createElement('article');
  card.dataset.category = service.categoria;
  const number = document.createElement('span');
  number.className = 'number';
  number.textContent = String(index + 1).padStart(2, '0');
  const heading = document.createElement('h3');
  heading.textContent = service.nombre;
  const description = document.createElement('p');
  description.textContent = service.descripcion;
  const price = document.createElement('strong');
  price.className = 'price';
  price.textContent = service.precio;
  const visual = document.createElement('div');
  visual.className = 'product-art product-' + index;
  visual.setAttribute('aria-hidden', 'true');
  visual.innerHTML = service.categoria === 'pan'
    ? '<div class="pastry"><i></i><i></i><i></i></div><span class="art-caption">HORNEADO CON CALMA</span>'
    : '<div class="drink"><i></i><span>m&g</span></div><span class="art-caption">UN MOMENTO PARA TI</span>';
  const add = document.createElement('button');
  add.type = 'button';
  add.className = 'add-product';
  add.textContent = 'Agregar +';
  add.setAttribute('aria-label', 'Agregar ' + service.nombre);
  add.addEventListener('click', () => updateCart(index, 1));
  const bottom = document.createElement('div');
  bottom.className = 'product-bottom';
  bottom.append(price, add);
  card.append(visual, number, heading, description, bottom);
  document.getElementById('service-list').append(card);
});
negocio.ventajas.forEach(value => {
  const item = document.createElement('li');
  item.textContent = value;
  document.getElementById('benefits').append(item);
});
if (/^[1-9]\d{6,14}$/.test(negocio.whatsapp)) {
  const link = document.getElementById('whatsapp');
  link.href = 'https://wa.me/' + negocio.whatsapp + '?text=' + encodeURIComponent(negocio.mensaje);
  link.hidden = false;
  document.getElementById('contact-placeholder').hidden = true;
}

// Filtros operables con ratón, teclado y lectores de pantalla.
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let visible = 0;
    document.querySelectorAll('#service-list article').forEach(card => {
      card.hidden = button.dataset.filter !== 'todos' && card.dataset.category !== button.dataset.filter;
      if (!card.hidden) visible++;
    });
    setText('menu-status', visible + ' productos disponibles en esta categoría.');
  });
});
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('reveal');
    observer.observe(section);
  });
}

const cart = new Map();
const money = value => '$' + value + ' MXN';
const unitPrice = item => Number(item.precio.replace(/[^0-9.]/g, ''));
let toastTimer;
function updateCart(index, change) {
  const quantity = Math.max(0, (cart.get(index) || 0) + change);
  if (quantity) cart.set(index, quantity); else cart.delete(index);
  renderCart();
  if (change > 0) {
    setText('toast', negocio.servicios[index].nombre + ' agregado a tu selección');
    document.getElementById('toast').classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => document.getElementById('toast').classList.remove('show'), 2500);
  }
}
function renderCart() {
  const list = document.getElementById('cart-items');
  list.replaceChildren();
  let total = 0, count = 0;
  cart.forEach((quantity, index) => {
    const item = negocio.servicios[index];
    total += unitPrice(item) * quantity;
    count += quantity;
    const row = document.createElement('div'); row.className = 'cart-row';
    const label = document.createElement('p'); label.textContent = item.nombre + ' · ' + money(unitPrice(item) * quantity);
    const controls = document.createElement('div'); controls.className = 'quantity';
    const minus = document.createElement('button'); minus.type = 'button'; minus.textContent = '−'; minus.setAttribute('aria-label', 'Quitar uno de ' + item.nombre);
    const plus = document.createElement('button'); plus.type = 'button'; plus.textContent = '+'; plus.setAttribute('aria-label', 'Añadir uno de ' + item.nombre);
    minus.addEventListener('click', () => { updateCart(index, -1); const next = list.querySelector('button'); (next || document.getElementById('cart-close')).focus(); });
    plus.addEventListener('click', () => { updateCart(index, 1); const buttons = list.querySelectorAll('button'); const position = [...cart.keys()].indexOf(index) * 2 + 1; buttons[position]?.focus(); });
    const value = document.createElement('span'); value.textContent = quantity;
    controls.append(minus, value, plus); row.append(label, controls); list.append(row);
  });
  if (!count) { const empty = document.createElement('p'); empty.textContent = 'Tu pausa está por empezar. Agrega algo rico del menú.'; list.append(empty); }
  setText('cart-count', count); setText('cart-total', money(total));
  document.getElementById('cart-clear').disabled = !count;
}
const cartDialog = document.getElementById('cart-dialog');
document.getElementById('cart-open').addEventListener('click', () => cartDialog.showModal());
document.getElementById('cart-close').addEventListener('click', () => cartDialog.close());
document.getElementById('cart-clear').addEventListener('click', () => { cart.clear(); renderCart(); setText('cart-message', 'Selección vaciada.'); });
const recommendations = { energia: 'Espresso + croissant · Una pareja clásica para empezar bien.', fresco: 'Cold brew + croissant · Una pausa fresca y crujiente.', dulce: 'Latte de la casa + rol de canela · Un abrazo en forma de merienda.' };
document.querySelectorAll('[data-mood]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-mood]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  setText('recommendation', recommendations[button.dataset.mood]);
}));
renderCart();
