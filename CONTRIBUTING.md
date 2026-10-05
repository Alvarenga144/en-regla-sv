# Cómo aportar a En regla

¡Gracias por querer mejorar el proyecto! Toda ayuda suma: corregir un dato, aclarar una explicación, arreglar un error o mejorar el diseño.

## Antes de empezar

- Para errores o datos desactualizados, abre un [issue](https://github.com/Alvarenga144/en-regla-sv/issues) con la fuente oficial si la tienes.
- Para cambios grandes (páginas nuevas, rediseños, cambios en la calculadora), abre primero un issue para conversarlo.
- El contenido es orientativo. Si cambias datos legales o de cálculo (ISSS, AFP, renta, salario mínimo, aguinaldo, vacaciones), cita siempre la fuente oficial: decreto, ley o sitio de la institución.

## Flujo de trabajo

1. Haz un fork del repositorio.
2. Crea una rama desde `main` con un nombre descriptivo, por ejemplo `fix/tope-isss` o `docs/glosario`.
3. Haz tus cambios en commits pequeños y claros.
4. Verifica en local (abajo).
5. Abre un pull request hacia `main` y completa la plantilla.

Nadie puede subir cambios directo a `main`. Cada pull request lo revisa y aprueba el mantenedor ([@Alvarenga144](https://github.com/Alvarenga144)) antes de integrarse, y se integra con *squash merge*. Puede que te pida ajustes; es parte normal de la revisión.

## Desarrollo local

Requiere [Node.js](https://nodejs.org/) 22.12 o superior.

```bash
npm install
npm run dev      # http://localhost:4321
```

Antes de abrir el pull request:

```bash
npm run build
npm test
npm run test:seo
```

## Buenas prácticas

- Un pull request por tema; mientras más pequeño, más rápido se revisa.
- No agregues dependencias sin conversarlo antes en un issue.
- Mantén el tono claro y sencillo de las guías, pensado para alguien en su primer empleo.
- Si cambias la interfaz, agrega capturas en el pull request.

## Licencia

Al aportar, aceptas que tu contribución se publique bajo la [licencia MIT](LICENSE) del proyecto.
