// Accept decimal comma/dot and consistently grouped thousands; never truncate cents.
export function parseAmount(raw) {
  const value = String(raw).trim();
  if (!value) return { value: null, error: '' };
  let normalized;
  if (/^\d+(?:[.,]\d{1,2})?$/.test(value)) normalized = value.replace(',', '.');
  else if (/^\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?$/.test(value)) normalized = value.replaceAll(',', '');
  else if (/^\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?$/.test(value)) normalized = value.replaceAll('.', '').replace(',', '.');
  else return { value: null, error: 'Usa hasta 2 decimales: 1208.05 o 1208,05. Para miles: 1,208.05 o 1.208,05.' };
  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount > 1000000) return { value: null, error: 'Ingresa un importe entre 0 y 1,000,000 USD.' };
  return { value: amount, error: '' };
}
