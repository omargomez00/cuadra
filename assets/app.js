/* =========================================================
   CUADRA — Lógica de la aplicación (demo con localStorage)
   Vistas: cajero · ventas · inventario · reportes · configuración
   ========================================================= */

/* ---------------- 1. Catálogo base ---------------- */
const CLAVE = 'cuadra.demo.v2';
const CATEGORIAS = ['Abarrotes', 'Bebidas', 'Aseo', 'Panadería'];

const PRODUCTOS_BASE = [
  { id: 'p01', sku: 'ARR-001', nombre: 'Arroz Diana 1 kg',       categoria: 'Abarrotes', precio: 4800,  emoji: '🍚', stock: 24, stockMin: 8 },
  { id: 'p02', sku: 'ACE-002', nombre: 'Aceite Girasol 1 L',     categoria: 'Abarrotes', precio: 8900,  emoji: '🛢️', stock: 11, stockMin: 6 },
  { id: 'p03', sku: 'PAN-003', nombre: 'Panela cuadrada x2',     categoria: 'Abarrotes', precio: 3500,  emoji: '🧱', stock: 18, stockMin: 10 },
  { id: 'p04', sku: 'LEC-004', nombre: 'Leche entera 1 L',       categoria: 'Abarrotes', precio: 4300,  emoji: '🥛', stock: 4,  stockMin: 12 },
  { id: 'p05', sku: 'HUE-005', nombre: 'Huevos AA x30',          categoria: 'Abarrotes', precio: 14900, emoji: '🥚', stock: 9,  stockMin: 5 },
  { id: 'p06', sku: 'CAF-006', nombre: 'Café Águila 500 g',      categoria: 'Abarrotes', precio: 12400, emoji: '☕', stock: 7,  stockMin: 6 },
  { id: 'p07', sku: 'JAB-007', nombre: 'Jabón Rey 300 g',        categoria: 'Aseo',      precio: 3200,  emoji: '🧼', stock: 32, stockMin: 10 },
  { id: 'p08', sku: 'PAP-008', nombre: 'Papel higiénico x4',     categoria: 'Aseo',      precio: 7800,  emoji: '🧻', stock: 0,  stockMin: 6 },
  { id: 'p09', sku: 'GAS-009', nombre: 'Gaseosa 1.5 L',          categoria: 'Bebidas',   precio: 5500,  emoji: '🥤', stock: 21, stockMin: 12 },
  { id: 'p10', sku: 'AGU-010', nombre: 'Agua botella 600 ml',    categoria: 'Bebidas',   precio: 1500,  emoji: '💧', stock: 48, stockMin: 20 },
  { id: 'p11', sku: 'PTA-011', nombre: 'Pan tajado grande',      categoria: 'Panadería', precio: 5200,  emoji: '🍞', stock: 6,  stockMin: 4 },
  { id: 'p12', sku: 'ATU-012', nombre: 'Atún Van Camps 170 g',   categoria: 'Abarrotes', precio: 4900,  emoji: '🐟', stock: 15, stockMin: 8 },
  { id: 'p13', sku: 'SAL-013', nombre: 'Sal mesa 500 g',         categoria: 'Abarrotes', precio: 1800,  emoji: '🧂', stock: 27, stockMin: 10 },
  { id: 'p14', sku: 'CHO-014', nombre: 'Chocolate Corona 500 g', categoria: 'Abarrotes', precio: 9600,  emoji: '🍫', stock: 5,  stockMin: 4 },
  { id: 'p15', sku: 'DET-015', nombre: 'Detergente Ariel 900 g', categoria: 'Aseo',      precio: 11200, emoji: '🧴', stock: 13, stockMin: 6 },
  { id: 'p16', sku: 'JUG-016', nombre: 'Jugo Hit 500 ml',        categoria: 'Bebidas',   precio: 2800,  emoji: '🧃', stock: 34, stockMin: 15 }
];

/* ---------------- 2. Estado persistente ---------------- */
const ui = {
  vista: 'cajero',
  filtro: 'Todos',
  busqueda: '',
  pago: 'Efectivo',
  carrito: [],
  periodo: 'hoy',
  busquedaVenta: '',
  verAnuladas: false,
  invBusqueda: '',
  invCategoria: 'Todos',
  soloAlertas: false,
  ventaAbierta: null
};

function ventasDemo(productos) {
  const metodos = ['Efectivo', 'Nequi', 'Tarjeta'];
  const ventas = [];
  let folio = 101;
  const hoy = new Date();

  for (let d = 6; d >= 0; d--) {
    const dia = new Date(hoy);
    dia.setDate(hoy.getDate() - d);
    const cantidadVentas = d === 0 ? 7 : 4 + (d % 3);

    for (let k = 0; k < cantidadVentas; k++) {
      const items = [];
      const cuantos = 1 + ((d + k) % 3);

      for (let j = 0; j < cuantos; j++) {
        const p = productos[(d * 3 + k * 5 + j) % productos.length];
        const cantidad = 1 + ((k + j) % 2);
        items.push({ id: p.id, nombre: p.nombre, precio: p.precio, cantidad, emoji: p.emoji });
      }

      const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
      const fecha = new Date(dia);
      fecha.setHours(8 + ((k * 3) % 10), (k * 17 + 5) % 60, 0, 0);

      ventas.push({
        id: 'v' + folio,
        folio: String(folio),
        fecha: fecha.toISOString(),
        items,
        total,
        metodo: metodos[(d + k) % 3],
        estado: (d === 3 && k === 1) ? 'anulada' : 'pagada'
      });
      folio++;
    }
  }
  return ventas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

function semilla() {
  const productos = PRODUCTOS_BASE.map(p => ({ ...p }));
  const ventas = ventasDemo(productos);
  return {
    productos,
    ventas,
    folio: Math.max(...ventas.map(v => Number(v.folio))) + 1,
    config: {
      negocio: 'Minimercado La Esquina',
      nit: '901.456.789-3',
      telefono: '+57 300 123 4567',
      direccion: 'Calle 25 # 18-40, Sincelejo',
      alertas: true,
      resumen: true,
      offline: true
    }
  };
}

let S = cargar();

function cargar() {
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado) {
      const datos = JSON.parse(guardado);
      if (datos && datos.productos && datos.ventas) return datos;
    }
  } catch (e) { /* almacenamiento no disponible */ }
  const inicial = semilla();
  guardar(inicial);
  return inicial;
}

function guardar(datos = S) {
  try { localStorage.setItem(CLAVE, JSON.stringify(datos)); } catch (e) { /* modo privado */ }
}

/* ---------------- 3. Utilidades ---------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const dinero = n => new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP', maximumFractionDigits: 0
}).format(Math.round(n || 0));

const producto = id => S.productos.find(p => p.id === id);

const mismoDia = (a, b) => a.getFullYear() === b.getFullYear()
  && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

function fechaCorta(iso) {
  const f = new Date(iso);
  const ahora = new Date();
  const ayer = new Date(ahora); ayer.setDate(ahora.getDate() - 1);
  const hora = f.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  if (mismoDia(f, ahora)) return `Hoy, ${hora}`;
  if (mismoDia(f, ayer)) return `Ayer, ${hora}`;
  return f.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }) + `, ${hora}`;
}

const iconoPago = m => m === 'Efectivo' ? '💵' : m === 'Nequi' ? '📱' : '💳';

function estadoStock(p) {
  if (p.stock <= 0) return { texto: 'Agotado', clase: 'badge--agotado' };
  if (p.stock <= p.stockMin) return { texto: 'Stock bajo', clase: 'badge--bajo' };
  return { texto: 'Disponible', clase: 'badge--ok' };
}

/* ---------------- 4. Catálogo y carrito ---------------- */
function renderChips() {
  const cont = $('#chips');
  if (!cont) return;
  const lista = ['Todos', ...CATEGORIAS];
  cont.innerHTML = lista.map(c =>
    `<button class="chip${c === ui.filtro ? ' activo' : ''}" data-cat="${c}">${c}</button>`
  ).join('');
}

function renderProductos() {
  const cont = $('#productos');
  if (!cont) return;

  const texto = ui.busqueda.trim().toLowerCase();
  const lista = S.productos.filter(p =>
    (ui.filtro === 'Todos' || p.categoria === ui.filtro) &&
    (!texto || p.nombre.toLowerCase().includes(texto))
  );

  if (!lista.length) {
    cont.innerHTML = `<div class="vacio">No encontramos productos con “${ui.busqueda}”.</div>`;
    return;
  }

  cont.innerHTML = lista.map(p => {
    const agotado = p.stock <= 0;
    return `
      <button class="producto${agotado ? ' producto--agotado' : ''}"
              data-add="${p.id}" ${agotado ? 'disabled' : ''}
              aria-label="Agregar ${p.nombre}">
        <span class="producto__foto" aria-hidden="true">${p.emoji}</span>
        <span class="producto__nombre">${p.nombre}</span>
        ${agotado ? '<span class="producto__tag">Agotado</span>' : ''}
        <span class="producto__pie">
          <span class="producto__precio">${dinero(p.precio)}</span>
          <span class="producto__mas" aria-hidden="true">+</span>
        </span>
      </button>`;
  }).join('');
}

function totales() {
  const items = ui.carrito.map(l => ({ ...l, producto: producto(l.id) })).filter(l => l.producto);
  const unidades = items.reduce((s, l) => s + l.cantidad, 0);
  const total = items.reduce((s, l) => s + l.producto.precio * l.cantidad, 0);
  return { items, unidades, total };
}

function renderCarrito() {
  const cont = $('#items');
  if (!cont) return;
  const { items, unidades, total } = totales();

  if (!items.length) {
    cont.innerHTML = `
      <div class="ticket__vacio">
        <span aria-hidden="true">🧾</span>
        <b>La venta está vacía</b>
        <span>Toca un producto del catálogo para empezar.</span>
      </div>`;
  } else {
    cont.innerHTML = items.map(({ producto: p, cantidad }) => `
      <div class="linea">
        <span class="linea__foto" aria-hidden="true">${p.emoji}</span>
        <div>
          <div class="linea__nombre">${p.nombre}</div>
          <div class="linea__precio">${dinero(p.precio)} c/u · ${p.stock} disp.</div>
          <div class="stepper">
            <button data-menos="${p.id}" aria-label="Quitar una unidad">−</button>
            <span>${cantidad}</span>
            <button data-mas="${p.id}" aria-label="Agregar una unidad">+</button>
          </div>
        </div>
        <div class="linea__fin">
          <div class="linea__total">${dinero(p.precio * cantidad)}</div>
        </div>
      </div>`).join('');
  }

  $('#cantidadItems').textContent = `${unidades} ${unidades === 1 ? 'artículo' : 'artículos'}`;
  $('#subtotal').textContent = dinero(total);
  $('#total').textContent = dinero(total);
  $('#cobrarTotal').textContent = dinero(total);
  $('#cobrar').disabled = unidades === 0;
  $('#folio').textContent = `#${S.folio}`;

  const barra = $('#cartBar');
  if (barra) {
    $('#cartBarTotal').textContent = dinero(total);
    $('#cartBarInfo').textContent = `${unidades} ${unidades === 1 ? 'artículo' : 'artículos'}`;
    barra.hidden = !(ui.vista === 'cajero' && unidades > 0);
  }
}

function agregar(id, delta = 1) {
  const p = producto(id);
  if (!p) return;
  const linea = ui.carrito.find(l => l.id === id);
  const actual = linea ? linea.cantidad : 0;

  if (delta > 0 && actual >= p.stock) {
    aviso(`Solo quedan ${p.stock} unidades de ${p.nombre}`);
    return;
  }

  if (linea) {
    linea.cantidad += delta;
    if (linea.cantidad <= 0) ui.carrito = ui.carrito.filter(l => l.id !== id);
  } else if (delta > 0) {
    ui.carrito.push({ id, cantidad: delta });
  }

  renderCarrito();
  if (delta > 0) aviso(`${p.nombre} agregado`);
}

/* ---------------- 5. Ventas ---------------- */
function ventasFiltradas() {
  const ahora = new Date();
  const hace7 = new Date(ahora); hace7.setDate(ahora.getDate() - 7);
  const texto = ui.busquedaVenta.trim().toLowerCase();

  return S.ventas.filter(v => {
    const f = new Date(v.fecha);
    if (ui.periodo === 'hoy' && !mismoDia(f, ahora)) return false;
    if (ui.periodo === 'semana' && f < hace7) return false;
    if (ui.periodo === 'anuladas' && v.estado !== 'anulada') return false;
    if (!ui.verAnuladas && v.estado === 'anulada' && ui.periodo !== 'anuladas') return false;
    if (texto) {
      const enItems = v.items.some(i => i.nombre.toLowerCase().includes(texto));
      if (!v.folio.includes(texto) && !enItems) return false;
    }
    return true;
  });
}

function renderVentas() {
  const lista = ventasFiltradas();
  const cont = $('#listaVentas');
  if (!cont) return;

  const validas = lista.filter(v => v.estado !== 'anulada');
  const total = validas.reduce((s, v) => s + v.total, 0);
  const ticket = validas.length ? total / validas.length : 0;
  const efectivo = validas.filter(v => v.metodo === 'Efectivo').reduce((s, v) => s + v.total, 0);

  $('#kpisVentas').innerHTML = `
    <div class="kpi"><span>Total vendido</span><b>${dinero(total)}</b><small>${validas.length} ventas registradas</small></div>
    <div class="kpi"><span>Ticket promedio</span><b>${dinero(ticket)}</b><small>por transacción</small></div>
    <div class="kpi"><span>Efectivo</span><b>${dinero(efectivo)}</b><small>${total ? Math.round(efectivo / total * 100) : 0} % del total</small></div>
    <div class="kpi kpi--alerta"><span>Anuladas</span><b>${lista.filter(v => v.estado === 'anulada').length}</b><small>en el periodo</small></div>`;

  if (!lista.length) {
    cont.innerHTML = `<div class="vacio">No hay ventas en este periodo.</div>`;
    return;
  }

  cont.innerHTML = lista.map(v => `
    <div class="item-fila" data-venta="${v.id}" role="button" tabindex="0">
      <span class="item-fila__ico" aria-hidden="true">${iconoPago(v.metodo)}</span>
      <div class="item-fila__main">
        <b>Venta #${v.folio}</b>
        <span>${fechaCorta(v.fecha)} · ${v.items.reduce((s, i) => s + i.cantidad, 0)} artículos</span>
      </div>
      <div class="item-fila__meta">${v.metodo}</div>
      <div class="item-fila__monto">${dinero(v.total)}</div>
      <span class="badge ${v.estado === 'anulada' ? 'badge--anulada' : 'badge--ok'}">${v.estado === 'anulada' ? 'Anulada' : 'Pagada'}</span>
    </div>`).join('');
}

function abrirVenta(id) {
  const v = S.ventas.find(x => x.id === id);
  if (!v) return;
  ui.ventaAbierta = id;

  $('#dvTitulo').textContent = `Venta #${v.folio}`;
  $('#dvFecha').textContent = `${fechaCorta(v.fecha)} · ${v.metodo}`;
  $('#dvTotal').textContent = dinero(v.total);
  $('#dvItems').innerHTML = v.items.map(i => `
    <div class="dv-linea">
      <span class="dv-linea__ico">${i.emoji || '📦'}</span>
      <div class="dv-linea__main">
        <b>${i.nombre}</b>
        <span>${i.cantidad} × ${dinero(i.precio)}</span>
      </div>
      <b class="dv-linea__total">${dinero(i.precio * i.cantidad)}</b>
    </div>`).join('');

  const anular = $('#dvAnular');
  anular.disabled = v.estado === 'anulada';
  anular.textContent = v.estado === 'anulada' ? 'Venta anulada' : 'Anular venta';

  $('#drawerVenta').classList.add('abierto');
  $('#drawerVenta').setAttribute('aria-hidden', 'false');
}

function cerrarVenta() {
  $('#drawerVenta').classList.remove('abierto');
  $('#drawerVenta').setAttribute('aria-hidden', 'true');
  ui.ventaAbierta = null;
}

function anularVenta() {
  const v = S.ventas.find(x => x.id === ui.ventaAbierta);
  if (!v || v.estado === 'anulada') return;
  v.estado = 'anulada';
  v.items.forEach(i => {
    const p = producto(i.id);
    if (p) p.stock += i.cantidad;
  });
  guardar();
  cerrarVenta();
  render();
  aviso(`Venta #${v.folio} anulada · stock devuelto`);
}

/* ---------------- 6. Inventario ---------------- */
function inventarioFiltrado() {
  const texto = ui.invBusqueda.trim().toLowerCase();
  return S.productos.filter(p => {
    if (ui.invCategoria !== 'Todos' && p.categoria !== ui.invCategoria) return false;
    if (texto && !(`${p.nombre} ${p.sku}`.toLowerCase().includes(texto))) return false;
    if (ui.soloAlertas && p.stock > p.stockMin) return false;
    return true;
  });
}

function renderInventario() {
  const lista = inventarioFiltrado();
  const cont = $('#listaInv');
  if (!cont) return;

  const unidades = S.productos.reduce((s, p) => s + p.stock, 0);
  const valor = S.productos.reduce((s, p) => s + p.stock * p.precio, 0);
  const alertas = S.productos.filter(p => p.stock <= p.stockMin).length;

  $('#kpisInv').innerHTML = `
    <div class="kpi"><span>Referencias</span><b>${S.productos.length}</b><small>productos activos</small></div>
    <div class="kpi"><span>Unidades</span><b>${unidades}</b><small>en bodega</small></div>
    <div class="kpi"><span>Valor inventario</span><b>${dinero(valor)}</b><small>a precio de venta</small></div>
    <div class="kpi kpi--alerta"><span>Alertas</span><b>${alertas}</b><small>productos en el mínimo</small></div>`;

  if (!lista.length) {
    cont.innerHTML = `<div class="vacio">No hay productos que coincidan con el filtro.</div>`;
    return;
  }

  cont.innerHTML = lista.map(p => {
    const est = estadoStock(p);
    return `
      <div class="item-fila" data-editar="${p.id}" role="button" tabindex="0">
        <span class="item-fila__ico" aria-hidden="true">${p.emoji}</span>
        <div class="item-fila__main">
          <b>${p.nombre}</b>
          <span>${p.sku} · ${p.categoria}</span>
        </div>
        <div class="item-fila__meta">${dinero(p.precio)}</div>
        <div class="stock">
          <button type="button" data-stock="${p.id}" data-delta="-1" aria-label="Quitar unidad">−</button>
          <b>${p.stock}</b>
          <button type="button" data-stock="${p.id}" data-delta="1" aria-label="Sumar unidad">+</button>
        </div>
        <span class="badge ${est.clase}">${est.texto}</span>
      </div>`;
  }).join('');
}

function ajustarStock(id, delta) {
  const p = producto(id);
  if (!p) return;
  p.stock = Math.max(0, p.stock + delta);
  guardar();
  render();
}

function abrirProducto(id) {
  const form = $('#formProducto');
  const p = id ? producto(id) : null;
  $('#mpTitulo').textContent = p ? 'Editar producto' : 'Nuevo producto';
  $('#mpId').value = p ? p.id : '';
  $('#mpNombre').value = p ? p.nombre : '';
  $('#mpPrecio').value = p ? p.precio : '';
  $('#mpStock').value = p ? p.stock : 0;
  $('#mpMin').value = p ? p.stockMin : 5;
  $('#mpCategoria').value = p ? p.categoria : 'Abarrotes';
  form.dataset.nuevo = p ? '0' : '1';
  $('#modalProducto').classList.add('abierto');
}

function guardarProducto(ev) {
  ev.preventDefault();
  const id = $('#mpId').value;
  const datos = {
    nombre: $('#mpNombre').value.trim(),
    precio: Number($('#mpPrecio').value || 0),
    stock: Math.max(0, Number($('#mpStock').value || 0)),
    stockMin: Math.max(0, Number($('#mpMin').value || 0)),
    categoria: $('#mpCategoria').value
  };
  if (!datos.nombre || datos.precio <= 0) { aviso('Completa nombre y precio'); return; }

  if (id) {
    Object.assign(producto(id), datos);
    aviso('Producto actualizado');
  } else {
    const nuevoId = 'p' + Date.now();
    S.productos.push({
      id: nuevoId,
      sku: 'SKU-' + String(S.productos.length + 1).padStart(3, '0'),
      emoji: '📦',
      ...datos
    });
    aviso('Producto creado');
  }
  guardar();
  $('#modalProducto').classList.remove('abierto');
  render();
}

/* ---------------- 7. Reportes ---------------- */
function renderReportes() {
  const cont = $('#barrasDias');
  if (!cont) return;

  const ahora = new Date();
  const dias = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(ahora); d.setDate(ahora.getDate() - i); d.setHours(0, 0, 0, 0);
    const total = S.ventas
      .filter(v => v.estado !== 'anulada' && mismoDia(new Date(v.fecha), d))
      .reduce((s, v) => s + v.total, 0);
    dias.push({ fecha: d, total });
  }
  const maxDia = Math.max(...dias.map(d => d.total), 1);

  cont.innerHTML = dias.map(d => {
    const alto = Math.max(4, Math.round(d.total / maxDia * 100));
    const etiqueta = d.fecha.toLocaleDateString('es-CO', { weekday: 'short' }).slice(0, 3);
    return `<div class="barra" title="${dinero(d.total)}">
      <span class="barra__valor">${Math.round(d.total / 1000)}k</span>
      <div class="barra__col" style="height:${alto}%"></div>
      <span class="barra__dia">${etiqueta}</span>
    </div>`;
  }).join('');

  /* KPIs de los últimos 7 días */
  const semana = S.ventas.filter(v => v.estado !== 'anulada' && new Date(v.fecha) >= dias[0].fecha);
  const totalSemana = semana.reduce((s, v) => s + v.total, 0);
  $('#kpisReportes').innerHTML = `
    <div class="kpi"><span>Ventas · 7 días</span><b>${dinero(totalSemana)}</b><small>${semana.length} transacciones</small></div>
    <div class="kpi"><span>Ticket promedio</span><b>${dinero(semana.length ? totalSemana / semana.length : 0)}</b><small>última semana</small></div>
    <div class="kpi"><span>Productos vendidos</span><b>${semana.reduce((s, v) => s + v.items.reduce((a, i) => a + i.cantidad, 0), 0)}</b><small>unidades</small></div>
    <div class="kpi kpi--alerta"><span>Stock crítico</span><b>${S.productos.filter(p => p.stock <= p.stockMin).length}</b><small>requieren reposición</small></div>`;

  /* Métodos de pago */
  const metodos = ['Efectivo', 'Nequi', 'Tarjeta'];
  $('#metodosPago').innerHTML = metodos.map(m => {
    const t = semana.filter(v => v.metodo === m).reduce((s, v) => s + v.total, 0);
    const pct = totalSemana ? Math.round(t / totalSemana * 100) : 0;
    return `<div class="metodo">
      <div class="metodo__cab"><span>${iconoPago(m)} ${m}</span><b>${dinero(t)}</b></div>
      <div class="metodo__pista"><span style="width:${pct}%"></span></div>
      <small>${pct} % de las ventas</small>
    </div>`;
  }).join('');

  /* Top productos */
  const conteo = {};
  semana.forEach(v => v.items.forEach(i => {
    if (!conteo[i.id]) conteo[i.id] = { nombre: i.nombre, emoji: i.emoji || '📦', unidades: 0, total: 0 };
    conteo[i.id].unidades += i.cantidad;
    conteo[i.id].total += i.precio * i.cantidad;
  }));
  const top = Object.values(conteo).sort((a, b) => b.unidades - a.unidades).slice(0, 5);

  $('#topProductos').innerHTML = top.length ? top.map((p, i) => `
    <div class="top-item">
      <span class="top-item__pos">${i + 1}</span>
      <span class="top-item__ico">${p.emoji}</span>
      <div class="top-item__main"><b>${p.nombre}</b><span>${p.unidades} unidades</span></div>
      <b class="top-item__total">${dinero(p.total)}</b>
    </div>`).join('') : '<p class="muted">Sin datos todavía.</p>';

  /* Cuadre del día */
  const hoy = S.ventas.filter(v => v.estado !== 'anulada' && mismoDia(new Date(v.fecha), ahora));
  const efectivoHoy = hoy.filter(v => v.metodo === 'Efectivo').reduce((s, v) => s + v.total, 0);
  const base = 50000;
  $('#cuadreHoy').innerHTML = `
    <div class="fila"><span>Base inicial</span><b>${dinero(base)}</b></div>
    <div class="fila"><span>Ventas en efectivo</span><b>${dinero(efectivoHoy)}</b></div>
    <div class="fila"><span>Transferencias</span><b>${dinero(hoy.filter(v => v.metodo !== 'Efectivo').reduce((s, v) => s + v.total, 0))}</b></div>
    <div class="fila fila--total"><span>Efectivo esperado</span><b>${dinero(base + efectivoHoy)}</b></div>`;
}

/* ---------------- 8. Configuración ---------------- */
function renderConfig() {
  const c = S.config;
  if (!$('#cfgNegocio')) return;
  $('#cfgNegocio').value = c.negocio;
  $('#cfgNit').value = c.nit;
  $('#cfgTelefono').value = c.telefono;
  $('#cfgDireccion').value = c.direccion;
  $$('.switch[data-switch]').forEach(sw => {
    sw.setAttribute('aria-checked', String(!!c[sw.dataset.switch]));
  });
}

/* ---------------- 9. Router ---------------- */
function ir(vista) {
  ui.vista = vista;

  $$('.vista').forEach(s => s.classList.toggle('activa', s.id === `vista-${vista}`));
  $$('.nav-item[data-ir], .bottom-nav a[data-ir]').forEach(a => {
    a.classList.toggle('activo', a.dataset.ir === vista);
  });

  if (location.hash !== `#${vista}`) history.replaceState(null, '', `#${vista}`);

  render();
  window.scrollTo({ top: 0 });
}

/* ---------------- 10. Cobro ---------------- */
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

const cerrarModal = () => $('#modal').classList.remove('abierto');

function confirmarVenta() {
  const { items, total } = totales();
  if (!total) return;

  const recibido = Number($('#efectivo').value || 0);
  if (ui.pago === 'Efectivo' && recibido && recibido < total) {
    aviso('El efectivo recibido es menor al total');
    return;
  }

  const venta = {
    id: 'v' + Date.now(),
    folio: String(S.folio),
    fecha: new Date().toISOString(),
    items: items.map(l => ({
      id: l.producto.id,
      nombre: l.producto.nombre,
      precio: l.producto.precio,
      cantidad: l.cantidad,
      emoji: l.producto.emoji
    })),
    total,
    metodo: ui.pago,
    estado: 'pagada'
  };

  /* Descuenta inventario */
  items.forEach(l => {
    const p = producto(l.producto.id);
    if (p) p.stock = Math.max(0, p.stock - l.cantidad);
  });

  S.ventas.unshift(venta);
  S.folio += 1;
  ui.carrito = [];
  guardar();

  cerrarModal();
  cerrarTicket();
  render();

  const cambio = ui.pago === 'Efectivo' && recibido ? ` · cambio ${dinero(recibido - total)}` : '';
  aviso(`Venta #${venta.folio} registrada${cambio}`);
}

/* ---------------- 11. Aviso ---------------- */
let temporizador;
function aviso(texto) {
  const el = $('#toast');
  if (!el) return;
  el.querySelector('span').textContent = texto;
  el.classList.add('visible');
  clearTimeout(temporizador);
  temporizador = setTimeout(() => el.classList.remove('visible'), 2600);
}

/* ---------------- 12. Hoja móvil ---------------- */
const abrirTicket = () => {
  $('#ticket').classList.add('abierto');
  $('#scrim').classList.add('visible');
};
const cerrarTicket = () => {
  $('#ticket').classList.remove('abierto');
  $('#scrim').classList.remove('visible');
};

/* ---------------- 13. Render global ---------------- */
function renderResumen() {
  const ahora = new Date();
  const hoy = S.ventas.filter(v => v.estado !== 'anulada' && mismoDia(new Date(v.fecha), ahora));
  const totalHoy = hoy.reduce((s, v) => s + v.total, 0);
  const efectivoHoy = hoy.filter(v => v.metodo === 'Efectivo').reduce((s, v) => s + v.total, 0);
  const alertas = S.productos.filter(p => p.stock <= p.stockMin).length;

  if ($('#ventasHoy')) $('#ventasHoy').textContent = dinero(totalHoy);
  if ($('#efectivoHoy')) $('#efectivoHoy').textContent = dinero(50000 + efectivoHoy);
  if ($('#badgeVentas')) $('#badgeVentas').textContent = hoy.length;
  if ($('#badgeInv')) {
    const badge = $('#badgeInv');
    badge.textContent = alertas;
    badge.style.display = alertas ? 'grid' : 'none';
    badge.style.background = alertas ? '#F2A900' : 'transparent';
  }
}

function render() {
  renderChips();
  renderProductos();
  renderCarrito();
  renderResumen();

  if (ui.vista === 'ventas') renderVentas();
  if (ui.vista === 'inventario') renderInventario();
  if (ui.vista === 'reportes') renderReportes();
  if (ui.vista === 'config') renderConfig();
}

/* ---------------- 14. Eventos ---------------- */
function conectar() {
  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add) { agregar(add.dataset.add); return; }

    const mas = e.target.closest('[data-mas]');
    if (mas) { agregar(mas.dataset.mas, 1); return; }

    const menos = e.target.closest('[data-menos]');
    if (menos) { agregar(menos.dataset.menos, -1); return; }

    const chip = e.target.closest('#chips [data-cat]');
    if (chip) { ui.filtro = chip.dataset.cat; renderChips(); renderProductos(); return; }

    const pago = e.target.closest('[data-pago]');
    if (pago) {
      ui.pago = pago.dataset.pago;
      $$('.pago').forEach(b => b.classList.toggle('activo', b === pago));
      return;
    }

    const nav = e.target.closest('[data-ir]');
    if (nav) { e.preventDefault(); ir(nav.dataset.ir); return; }

    /* Filtros de ventas */
    const per = e.target.closest('[data-periodo]');
    if (per) {
      ui.periodo = per.dataset.periodo;
      $$('#chipsVentas .chip').forEach(c => c.classList.toggle('activo', c === per));
      renderVentas();
      return;
    }

    /* Filtros de inventario */
    const cat = e.target.closest('#chipsInv [data-cat]');
    if (cat) {
      ui.invCategoria = cat.dataset.cat;
      $$('#chipsInv .chip').forEach(c => c.classList.toggle('activo', c === cat));
      renderInventario();
      return;
    }

    const alerta = e.target.closest('#soloAlertas');
    if (alerta) {
      ui.soloAlertas = !ui.soloAlertas;
      alerta.setAttribute('aria-pressed', String(ui.soloAlertas));
      alerta.classList.toggle('activo', ui.soloAlertas);
      renderInventario();
      return;
    }

    /* Stock */
    const st = e.target.closest('[data-stock]');
    if (st) { ajustarStock(st.dataset.stock, Number(st.dataset.delta)); return; }

    /* Abrir/cerrar paneles */
    const venta = e.target.closest('[data-venta]');
    if (venta) { abrirVenta(venta.dataset.venta); return; }

    if (e.target.closest('[data-cerrar-drawer]')) { cerrarVenta(); return; }

    const editar = e.target.closest('[data-editar]');
    if (editar) { abrirProducto(editar.dataset.editar); return; }

    if (e.target.closest('#nuevoProducto')) { abrirProducto(null); return; }
    if (e.target.closest('[data-cerrar-modal]')) {
      $('#modalProducto').classList.remove('abierto');
      return;
    }

    const sw = e.target.closest('.switch[data-switch]');
    if (sw) {
      const clave = sw.dataset.switch;
      const nuevo = sw.getAttribute('aria-checked') !== 'true';
      sw.setAttribute('aria-checked', String(nuevo));
      S.config[clave] = nuevo;
      guardar();
      return;
    }

    if (e.target.closest('#abrirTicket')) { abrirTicket(); return; }
    if (e.target.closest('#cerrarTicket') || e.target.id === 'scrim') { cerrarTicket(); return; }
    if (e.target.closest('#cobrar')) { abrirModal(); return; }
    if (e.target.closest('#cerrarModal') || e.target.id === 'modal') { cerrarModal(); return; }
    if (e.target.closest('#confirmarVenta')) { confirmarVenta(); return; }
    if (e.target.closest('#dvAnular')) { anularVenta(); return; }
  });

  $('#buscar')?.addEventListener('input', e => { ui.busqueda = e.target.value; renderProductos(); });

  $('#buscarVenta')?.addEventListener('input', e => {
    ui.busquedaVenta = e.target.value;
    renderVentas();
  });

  $('#buscarInv')?.addEventListener('input', e => {
    ui.invBusqueda = e.target.value;
    renderInventario();
  });

  $('#formProducto')?.addEventListener('submit', guardarProducto);

  $('#formConfig')?.addEventListener('submit', (e) => {
    e.preventDefault();
    S.config.negocio = $('#cfgNegocio').value.trim();
    S.config.nit = $('#cfgNit').value.trim();
    S.config.telefono = $('#cfgTelefono').value.trim();
    S.config.direccion = $('#cfgDireccion').value.trim();
    guardar();
    aviso('Configuración guardada');
  });

  $('#efectivo')?.addEventListener('input', (e) => {
    const valor = Number(e.target.value || 0);
    $('#cambio').textContent = dinero(Math.max(0, valor - totalPendiente));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { cerrarModal(); cerrarTicket(); cerrarVenta(); }
  });

  window.addEventListener('hashchange', () => {
    const v = location.hash.replace('#', '') || 'cajero';
    if (v !== ui.vista) ir(v);
  });
}

/* ---------------- 15. Arranque ---------------- */
conectar();
ir(location.hash.replace('#', '') || 'cajero');
