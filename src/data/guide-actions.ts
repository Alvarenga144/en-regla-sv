export const guideActions: Record<string, {you: string; employer: string; check: string; message: string; next: string; label: string}> = {
  '/contrato/': {
    you: 'Lee salario, horario, fecha de inicio y modalidad. Pide una copia firmada y guarda la oferta.',
    employer: 'Documenta lo acordado y entrega tu copia del contrato.',
    check: 'Compara el documento con lo que te ofrecieron; pregunta por cualquier diferencia antes de firmar.',
    message: '¿Me pueden compartir el contrato e indicar el salario bruto, horario, fecha de pago y cómo gestionarán ISSS y AFP?', next: '/isss/', label: 'Seguro social',
  },
  '/isss/': {
    you: 'Entrega los documentos solicitados y pregunta si ya tienes un número de afiliación.',
    employer: 'Gestiona la inscripción y reporta las cotizaciones que corresponden.',
    check: 'Consulta tu acreditación y los períodos reportados con el ISSS. El descuento en el boleto por sí solo no comprueba el pago.',
    message: '¿Me pueden confirmar mi número de afiliación al ISSS y desde qué período están reportando mis cotizaciones?', next: '/afp/', label: 'Tu AFP',
  },
  '/afp/': {
    you: 'Comprueba si ya estás afiliado; si no, elige una AFP y comunica la afiliación a la empresa.',
    employer: 'Retiene tu aporte, suma el suyo y reporta los pagos a la administradora.',
    check: 'Revisa tu estado de cuenta por período. Si falta un mes, consulta primero las fechas de reporte con tu AFP.',
    message: '¿Qué AFP y número de afiliación tienen registrados para mí? ¿Me pueden confirmar el último período pagado?', next: '/banco/', label: 'Cuenta de banco',
  },
  '/banco/': {
    you: 'Confirma qué cuenta acepta la empresa y revisa comisiones, saldo mínimo y acceso a la banca digital.',
    employer: 'Te indica la fecha de pago y los datos bancarios necesarios para depositarte.',
    check: 'Verifica titular, número de cuenta y primer depósito. Nunca entregues claves, PIN ni códigos de acceso.',
    message: '¿Puedo usar mi cuenta actual para recibir la planilla? ¿Qué datos necesitan y en qué fechas depositan?', next: '/salario/', label: 'Tu salario',
  },
  '/renta/': {
    you: 'Reúne constancias de ingresos y retenciones de todos tus trabajos e ingresos del año.',
    employer: 'Retiene y reporta el impuesto aplicable, y te entrega la constancia correspondiente.',
    check: 'Compara tus documentos con los datos de Hacienda y confirma si debes presentar el F-11 para ese ejercicio.',
    message: '¿Me pueden entregar mi constancia anual de ingresos y retenciones para revisar la declaración de renta?', next: '/boleto/', label: 'Leer tu boleto',
  },
};
