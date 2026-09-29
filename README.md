# En regla

Guía y calculadora para empezar a trabajar en regla en El Salvador. Está pensada para quien sale del bachillerato o de la universidad y entra a su primer empleo formal: qué se firma, qué se tramita, qué le descuentan del salario y cuándo toca mirar la renta.

Sitio: [en-regla.sv](https://en-regla.sv)

Es material orientativo, personal y sin fines de lucro. No es asesoría legal, laboral ni fiscal, y no representa al ISSS, a ninguna AFP, al Ministerio de Trabajo ni al Ministerio de Hacienda. Las reglas cambian: antes de un trámite o un reclamo, confirma el caso con la institución que corresponda.

## Contenido

| Ruta | Qué cubre |
| --- | --- |
| `/` | Recorrido del primer empleo y glosario breve |
| `/contrato/` | Contrato por escrito, período de prueba y planilla |
| `/isss/` | Seguro social: inscripción y descuento |
| `/afp/` | Elección de AFP y la cuenta de pensión |
| `/banco/` | Cuenta para recibir el depósito de planilla |
| `/salario/` | Calculadora de descuentos, aguinaldo y costo para la empresa |
| `/renta/` | Retención mensual y declaración de renta |

## Calculadora

En `/salario/` se estima el depósito mensual a partir del salario del contrato: ISSS, AFP y renta. Aparte calcula aguinaldo, quincena 25, vacaciones y el costo anual para la empresa. Si se escribe el depósito real del mes, lo compara con esa estimación.

Lo que se escribe se queda en el navegador. El sitio no tiene backend y no envía esos datos a ningún servidor.

La estimación usa las reglas vigentes hacia septiembre de 2026:

- Retención de renta: tablas del Decreto Ejecutivo 10 de 2025.
- ISSS del trabajador: 3 %, con tope de $1,000.
- AFP del trabajador: 7.25 %, sin tope desde enero de 2023.
- Aguinaldo legal: 15, 19 o 21 días, según el tiempo en el trabajo.
- Quincena 25: 50 % si el salario nominal es de $1,500 o menos.
- Vacaciones: 15 días más 30 %.
- Salarios mínimos del Decreto Ejecutivo 11, desde el 1 de junio de 2025: comercio, servicios e industria $408.80; maquila textil y confección $402.32; sector agrícola $305.23.

## Desarrollo

Requiere [Node.js](https://nodejs.org/) 22.12 o superior.

```bash
npm install
npm run dev
```

El servidor de desarrollo queda en `http://localhost:4321`.

```bash
npm run build    # genera el sitio estático en dist/
npm run preview  # sirve esa carpeta en local
```

La URL canónica (`https://en-regla.sv`) está en `astro.config.mjs`. Ahí también se genera el sitemap.

## Estructura

```text
src/
  pages/        rutas del sitio
  components/   navegación, pie y bloques de la guía
  layouts/      plantilla base
  scripts/      lógica de la calculadora
  data/         nombre, autor y menú
  styles/       estilos globales
```

## Stack

- [Astro](https://astro.build/) 7
- [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)

## Licencia

[MIT](LICENSE). Copyright © 2026 [Esteban Alvarenga](https://estebanalvarenga.com).
