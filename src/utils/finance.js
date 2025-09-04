export const formatCurrency = (amount) => {
  if (!amount || isNaN(amount)) return '0 UZS';
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return '-';
  try {
    return new Date(date).toLocaleDateString('uz-UZ');
  } catch (error) {
    return '-';
  }
}; 