# Cuadra

Plantilla web del proyecto **Cuadra**: plataforma de gestión comercial y de inventarios para micro y pequeñas empresas, bajo un modelo SaaS con arquitectura PWA *offline-first*.

Proyecto de **Formulación y Evaluación de Proyectos** — Programa de Ingeniería de Sistemas, Corporación Universitaria Antonio José de Sucre (Sincelejo, Sucre).

## Vistas

| Vista | Archivo | Descripción |
| --- | --- | --- |
| Portada | `index.html` | Redirección al sitio |
| Producto / Nosotros | `nosotros.html` | Landing: propuesta de valor, funcionalidades, planes y validación de mercado |
| Aplicación | `cajero.html` | Cajero, ventas, inventario, reportes y configuración |
| Vista previa | `preview.html` | Maqueta con las tres vistas a escala |

### Módulos de la aplicación

- **Cajero:** catálogo, carrito, métodos de pago y cobro con cálculo de cambio.
- **Ventas:** historial por periodo, KPIs, detalle de cada venta y anulación con devolución de stock.
- **Inventario:** existencias, ajustes de stock, alertas de reposición y alta/edición de productos.
- **Reportes:** ventas por día, métodos de pago, productos más vendidos y cuadre de caja.
- **Configuración:** datos del negocio y preferencias.

Los datos de la demo se guardan en `localStorage`, así que las ventas del cajero se reflejan en los demás módulos y persisten al recargar.

## Estructura

```
.
├── index.html
├── nosotros.html
├── cajero.html
├── preview.html
└── assets/
    ├── app.css          # identidad visual y layout
    ├── app.js           # lógica del punto de venta (demo, sin backend)
    └── logo-cuadra.svg  # isologo vectorial
```

## Identidad

- Verde `#0E7B4F`
- Ámbar `#F2A900`
- Menta `#E9F6EF`

Tipografía del sistema (sin dependencias externas). No requiere build ni servidor: son archivos estáticos.

## Estado

Prototipo de interfaz. La vista de cajero funciona con datos de ejemplo en memoria (carrito, cobro y cálculo de cambio); no hay persistencia ni conexión con el backend descrito en el documento del proyecto.

## Autores

Omar Augusto Gómez Fuentes · Johan Marín Acosta · Iván Daniel Monterroza Jiménez · Moises David Pacheco Meza · Andrés Felipe Sánchez Acuña · Juan Gabriel Tapia García

Docente: Yurleidys Ortega Benavides
