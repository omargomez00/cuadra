/* =========================================================
   CUADRA — Lógica de la vista de cajero (demo, sin backend)
   ========================================================= */

const PRODUCTOS = [
  { id: 'p01', nombre: 'Arroz Diana 1 kg',        categoria: 'Abarrotes', precio: 4800,  emoji: '🍚' },
  { id: 'p02', nombre: 'Aceite Girasol 1 L',      categoria: 'Abarrotes', precio: 8900,  emoji: '🛢️' },
  { id: 'p03', nombre: 'Panela cuadrada x2',      categoria: 'Abarrotes', precio: 3500,  emoji: '🧱' },
  { id: 'p04', nombre: 'Leche entera 1 L',        categoria: 'Abarrotes', precio: 4300,  emoji: '🥛' },
  { id: 'p05', nombre: 'Huevos AA x30',           categoria: 'Abarrotes', precio: 14900, emoji: '🥚' },
  { id: 'p06', nombre: 'Café Águila 500 g',       categoria: 'Abarrotes', precio: 12400, emoji: '☕' },
  { id: 'p07', nombre: 'Jabón Rey 300 g',         categoria: 'Aseo',      precio: 3200,  emoji: '🧼' },
  { id: 'p08', nombre: 'Papel higiénico x4',      categoria: 'Aseo',      precio: 7800,  emoji: '🧻' },
  { id: 'p09', nombre: 'Gaseosa 1.5 L',           categoria: 'Bebidas',   precio: 5500,  emoji: '🥤' },
  { id: 'p10', nombre: 'Agua botella 600 ml',     categoria: 'Bebidas',   precio: 1500,  emoji: '💧' },
  { id: 'p11', nombre: 'Pan tajado grande',       categoria: 'Panadería', precio: 5200,  emoji: '🍞' },
  { id: 'p12', nombre: 'Atún Van Camps 170 g',    categoria: 'Abarrotes', precio: 4900,  emoji: '🐟' }
];

const CATEGORIAS = ['Todos', 'Abarrotes', 'Bebidas', 'Aseo', 'Panadería'];

const estado = {
  filtro: 'Todos',
  busqueda: '',
  pago: 'Efectivo',
  folio: 124,
  carrito: [
    { id: 'p01', cantidad: 2 },
    { id: 'p02', cantidad: 1 },
    { id: 'p09', cantidad: 1 }
  ]
};

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const dinero = n => new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP', maximumFractionDigits: 0
}).format(n);
const buscarProducto = id => PRODUCTOS.find(p => p.id === id);

/* ---------------- Catálogo ---------------- */
function renderChips() {
  const cont = $('#chips');
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map(c => `
    <button class="chip${c === estado.filtro ? ' activo' : ''}" data-cat="${c}">${c}</button>
  `).join('');
}

function renderProductos() {
  const cont = $('#productos');
  if (!cont) return;

  const texto = estado.busqueda.trim().toLowerCase();
  const lista = PRODUCTOS.filter(p =>
    (estado.filtro === 'Todos' || p.categoria === estado.filtro) &&
    (!texto || p.nombre.toLowerCase().includes(texto))
  );

  if (!lista.length) {
    cont.innerHTML = `<div class="vacio">No encontramos productos con “${estado.busqueda}”.</div>`;
    return;
  }

  cont.innerHTML = lista.map(p => `
    <button class="producto" data-add="${p.id}" aria-label="Agregar ${p.nombre}">
      <span class="producto__foto" aria-hidden="true">${p.emoji}</span>
      <span class="producto__nombre">${p.nombre}</span>
      <span class="producto__pie">
        <span class="producto__precio">${dinero(p.precio)}</span>
        <span class="producto__mas" aria-hidden="true">+</span>
      </span>
    </button>
  `).join('');
}

/* ---------------- Carrito ---------------- */
function totales() {
  const items = estado.carrito.map(l => ({ ...l, producto: buscarProducto(l.id) }));
  const unidades = items.reduce((s, l) => s + l.cantidad, 0);
  const subtotal = items.reduce((s, l) => s + l.producto.precio * l.cantidad, 0);
  return { items, unidades, subtotal, total: subtotal };
}

function renderCarrito() {
  const cont = $('#items');
  const { items, unidades, total } = totales();
  if (!cont) return;

  if (!items.length) {
    cont.innerHTML = `
      <div class="ticket__vacio">
        <span aria-hidden="true">🧾</span>
        <b>La venta está vacía</b>
        <span>Toca un producto del catálogo para empezar.</span>
      </div>`;
  } else {
    cont.innerHTML = items.map(({ producto, cantidad }) => `
      <div class="linea">
        <span class="linea__foto" aria-hidden="true">${producto.emoji}</span>
        <div>
          <div class="linea__nombre">${producto.nombre}</div>
          <div class="linea__precio">${dinero(producto.precio)} c/u</div>
          <div class="stepper">
            <button data-menos="${producto.id}" aria-label="Quitar una unidad">−</button>
            <span>${cantidad}</span>
            <button data-mas="${producto.id}" aria-label="Agregar una unidad">+</button>
          </div>
        </div>
        <div class="linea__fin">
          <div class="linea__total">${dinero(producto.precio * cantidad)}</div>
        </div>
      </div>
    `).join('');
  }

  $('#cantidadItems').textContent = `${unidades} ${unidades === 1 ? 'artículo' : 'artículos'}`;
  $('#subtotal').textContent = dinero(total);
  $('#total').textContent = dinero(total);
  $('#cobrarTotal').textContent = dinero(total);
  $('#cobrar').disabled = unidades === 0;

  const barra = $('#cartBar');
  if (barra) {
    $('#cartBarTotal').textContent = dinero(total);
    $('#cartBarInfo').textContent = `${unidades} ${unidades === 1 ? 'artículo' : 'artículos'}`;
    barra.hidden = unidades === 0;
  }
}

function agregar(id, delta = 1) {
  const linea = estado.carrito.find(l => l.id === id);
  if (linea) {
    linea.cantidad += delta;
    if (linea.cantidad <= 0) estado.carrito = estado.carrito.filter(l => l.id !== id);
  } else if (delta > 0) {
    estado.carrito.push({ id, cantidad: delta });
  }
  renderCarrito();
  const producto = buscarProducto(id);
  if (delta > 0 && producto) aviso(`${producto.nombre} agregado`);
}

/* ---------------- Hoja móvil ---------------- */
function abrirTicket() {
  $('#ticket').classList.add('abierto');
  $('#scrim').classList.add('visible');
}
function cerrarTicket() {
  $('#ticket').classList.remove('abierto');
  $('#scrim').classList.remove('visible');
}

/* ---------------- Cobro ---------------- */
let totalPendiente = 0;

function abrirModal() {
  const { total } = totales();
  if (!total) return;
  totalPendiente = total;
  $('#modalTotal').textContent = dinero(total);
  $('#efectivo').value = '';
  $('#cambio').textContent = dinero(0);
  $('#modal').classList.add('abierto');
  setTimeout(() => $('#efectivo').focus(), 220);
}

function cerrarModal() { $('#modal').classList.remove('abierto'); }

function confirmarVenta() {
  const recibido = Number($('#efectivo').value || 0);
  if (estado.pago === 'Efectivo' && recibido && recibido < totalPendiente) {
    aviso('El efectivo recibido es menor al total');
    return;
  }
  const unidad = estado.pago === 'Efectivo' ? 'caja' : estado.pago.toLowerCase();
  const mensaje = estado.pago === 'Efectivo' && recibido
    ? `Venta #${estado.folio} · cambio ${dinero(recibido - totalPendiente)}`
    : `Venta #${estado.folio} pagada con ${unidad}`;

  estado.folio += 1;
  estado.carrito = [];
  renderCarrito();
  cerrarModal();
  cerrarTicket();
  $('#folio').textContent = `#${String(estado.folio).padStart(3, '0')}`;
  aviso(mensaje);
}

/* ---------------- Aviso ---------------- */
let temporizador;
function aviso(texto) {
  const el = $('#toast');
  if (!el) return;
  el.querySelector('span').textContent = texto;
  el.classList.add('visible');
  clearTimeout(temporizador);
  temporizador = setTimeout(() => el.classList.remove('visible'), 2600);
}

/* ---------------- Eventos ---------------- */
function conectar() {
  document.addEventListener('click', (e) => {
    const agregarBtn = e.target.closest('[data-add]');
    if (agregarBtn) { agregar(agregarBtn.dataset.add); return; }

    const mas = e.target.closest('[data-mas]');
    if (mas) { agregar(mas.dataset.mas, 1); return; }

    const menos = e.target.closest('[data-menos]');
    if (menos) { agregar(menos.dataset.menos, -1); return; }

    const chip = e.target.closest('[data-cat]');
    if (chip) {
      estado.filtro = chip.dataset.cat;
      renderChips();
      renderProductos();
      return;
    }

    const pago = e.target.closest('[data-pago]');
    if (pago) {
      estado.pago = pago.dataset.pago;
      $$('.pago').forEach(b => b.classList.toggle('activo', b === pago));
      return;
    }
  });

  const buscador = $('#buscar');
  if (buscador) {
    buscador.addEventListener('input', () => {
      estado.busqueda = buscador.value;
      renderProductos();
    });
  }

  const cobrar = $('#cobrar');
  if (cobrar) cobrar.addEventListener('click', abrirModal);

  $('#cerrarModal')?.addEventListener('click', cerrarModal);
  $('#confirmarVenta')?.addEventListener('click', confirmarVenta);
  $('#modal')?.addEventListener('click', (e) => { if (e.target.id === 'modal') cerrarModal(); });

  $('#efectivo')?.addEventListener('input', (e) => {
    const valor = Number(e.target.value || 0);
    $('#cambio').textContent = dinero(Math.max(0, valor - totalPendiente));
  });

  $('#abrirTicket')?.addEventListener('click', abrirTicket);
  $('#cerrarTicket')?.addEventListener('click', cerrarTicket);
  $('#scrim')?.addEventListener('click', cerrarTicket);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { cerrarModal(); cerrarTicket(); }
  });
}

renderChips();
renderProductos();
renderCarrito();
conectar();
