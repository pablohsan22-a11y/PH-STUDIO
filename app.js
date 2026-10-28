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
  card.append(number, heading, description, price);
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
