export const formatCurrency = (amount) => {
  const formatter = new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  });
  return formatter.format(amount || 0).replace('Bs', 'Bs.');
};