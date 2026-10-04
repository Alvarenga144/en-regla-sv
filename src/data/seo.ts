// Metadata describes the content on each page; it does not change the guide copy.
export const pageSeo: Record<string, { title: string; description: string; topic: string }> = {
  '/': {
    title: 'Primer empleo en El Salvador: guía y calculadora',
    description: '¿Empiezas tu primer trabajo en El Salvador? Entiende tu contrato, ISSS, AFP y renta, abre tu cuenta de planilla y calcula cuánto recibirás de salario.',
    topic: 'Primer empleo formal en El Salvador',
  },
  '/contrato/': {
    title: 'Contrato de trabajo en El Salvador: antes de firmar',
    description: 'Qué revisar antes de firmar tu primer contrato de trabajo en El Salvador: salario, horario, período de prueba, copia del contrato y pago por planilla.',
    topic: 'Contrato de trabajo y primer empleo',
  },
  '/isss/': {
    title: 'ISSS en tu primer empleo: inscripción y descuentos',
    description: 'Quién te inscribe al ISSS en El Salvador, qué documentos pueden pedirte, cuánto te descuentan del salario y cómo revisar tu acreditación de seguro social.',
    topic: 'Inscripción y cotizaciones del ISSS',
  },
  '/afp/': {
    title: 'AFP en El Salvador: afiliación y descuento del salario',
    description: 'Cómo elegir AFP en tu primer empleo, saber en cuál estás afiliado y entender el descuento de tu salario, los aportes de la empresa y la relación entre NUP y DUI.',
    topic: 'Afiliación y cotizaciones de AFP',
  },
  '/banco/': {
    title: 'Cuenta de planilla en El Salvador: tu primer salario',
    description: 'Qué necesitas para abrir una cuenta bancaria y recibir tu primer salario en El Salvador. Revisa requisitos, comisiones y los datos que pide tu empresa.',
    topic: 'Cuenta bancaria para recibir el salario',
  },
  '/salario/': {
    title: 'Calculadora de salario neto en El Salvador: ISSS y AFP',
    description: 'Calcula tu salario neto en El Salvador con descuentos de ISSS, AFP y renta. Compara tus depósitos y estima aguinaldo, vacaciones y quincena 25.',
    topic: 'Cálculo de salario neto, descuentos y prestaciones',
  },
  '/renta/': {
    title: 'Renta en El Salvador: retención y declaración F-11',
    description: 'Entiende la diferencia entre el descuento de renta de tu salario y la declaración anual F-11 en El Salvador: qué revisar y qué documentos guardar.',
    topic: 'Retención salarial y declaración anual de renta',
  },
  '/boleto/': {
    title: 'Cómo leer tu boleto de pago en El Salvador',
    description: 'Aprende a leer tu boleto de pago con un ejemplo explicado: salario bruto, ISSS, AFP, renta y neto. Revisa qué comparar con tus depósitos del mes.',
    topic: 'Boleto de pago y desglose salarial',
  },
  '/ayuda/': {
    title: 'Problemas con tu salario, contrato o cotizaciones',
    description: '¿Tu pago no cuadra o faltan cotizaciones? Qué revisar, qué documentos guardar y dónde consultar en El Salvador con MTPS, ISSS, AFP, SSF y Hacienda.',
    topic: 'Consultas sobre salario, contrato y cotizaciones en El Salvador',
  },
};
