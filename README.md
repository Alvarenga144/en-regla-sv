# En regla

Guía y calculadora para empezar a trabajar en regla en El Salvador. Está pensada para quien sale del bachillerato o de la universidad y entra a su primer empleo formal: qué se firma, qué se tramita, qué le descuentan del salario y cuándo toca mirar la renta.

Sitio: [enreglasv.com](https://enreglasv.com)

Si este repositorio te sirve, una estrella ayuda a que otros lo encuentren.

[![Estrellas en GitHub](https://img.shields.io/github/stars/Alvarenga144/en-regla-sv?style=social)](https://github.com/Alvarenga144/en-regla-sv)

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
| `/boleto/` | Ejemplo ficticio interactivo de comprobante de pago |
| `/ayuda/` | Diferencias de pago, documentos y canales oficiales |

## Calculadora

En `/salario/` se estima el neto mensual y se muestra su distribución gráfica. Se puede comparar un depósito mensual o sumar las dos quincenas del mismo mes. Los resultados detallados se abren por secciones. Aguinaldo, prima vacacional y bonos se presentan en bruto, sin mezclarlos con el neto ordinario. El escenario distingue la aplicación de quincena 25 en 2026 y 2027.

Los datos se procesan en el navegador. Solo se conservan entre visitas al activar “Recordar mis datos en este dispositivo”. “Limpiar calculadora” elimina ese guardado y restablece los campos. El sitio no tiene backend para estos datos.

Revisión editorial: 4 de octubre de 2026. La calculadora supone un único empleador y un mes ordinario completo; no determina obligaciones de declaración ni calcula liquidaciones o mínimos para jornadas parciales.

- Retención de renta: tablas del Decreto Ejecutivo 10 de 2025.
- ISSS del trabajador: 3 %, con tope de $1,000.
- AFP del trabajador: 7.25 %, sin tope desde enero de 2023.
- Aguinaldo legal: 15, 19 o 21 días, según el tiempo en el trabajo.
- Quincena 25: 50 % si el salario nominal es de $1,500 o menos.
- Vacaciones: 15 días más 30 %.
- Referencias mensuales (decretos 11 y 12 de 2025): comercio, servicios e industria $408.80; maquila $402.32; beneficios de café y recolección de caña $305.23; agropecuario y recolección de café $272.53.

## Desarrollo

Requiere [Node.js](https://nodejs.org/) 22.12 o superior.

```bash
npm install
npm run dev
```

El servidor de desarrollo queda en `http://localhost:4321`.

```bash
npm run build    # genera el sitio estático en dist/
npm test         # verifica cálculo mensual, límites y comparación de depósitos
npm run preview  # sirve esa carpeta en local
```

La URL canónica (`https://enreglasv.com`) está en `astro.config.mjs`. Ahí también se genera el sitemap.

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
