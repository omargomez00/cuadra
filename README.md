# Cuadra

Plantilla web del proyecto **Cuadra**: plataforma de gestión comercial y de inventarios para micro y pequeñas empresas, bajo un modelo SaaS con arquitectura PWA *offline-first*.

Proyecto de **Formulación y Evaluación de Proyectos** — Programa de Ingeniería de Sistemas, Corporación Universitaria Antonio José de Sucre (Sincelejo, Sucre).

## Vistas

| Vista | Archivo | Descripción |
| --- | --- | --- |
| Portada | `index.html` | Redirección al sitio |
| Producto / Nosotros | `nosotros.html` | Landing: propuesta de valor, funcionalidades, planes y validación de mercado |
| Cajero | `cajero.html` | Punto de venta responsive (escritorio y celular) |
| Vista previa | `preview.html` | Maqueta con las tres vistas a escala |

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
