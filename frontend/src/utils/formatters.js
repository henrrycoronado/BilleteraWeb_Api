// src/utils/formatters.js

/**
 * Formatea un número a una cadena de moneda local (Boliviano).
 * @param {number} amount - El monto a formatear.
 * @returns {string} - La cadena formateada, ej: "Bs. 1,250.50".
 */
export const formatCurrency = (amount) => {
  const formatter = new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB', // Código de moneda para el Boliviano
    minimumFractionDigits: 2,
  });

  // Reemplaza el símbolo 'Bs' por 'Bs.' para coincidir con la costumbre local
  return formatter.format(amount || 0).replace('Bs', 'Bs.');
};