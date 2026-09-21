/**
 * Format number to currency string
 * @param nAmount - The number to format
 * @returns sFormattedCurrency - The formatted string
 */
export const formatCurrency = (nAmount: number): string => {
  const sFormattedCurrency = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  }).format(nAmount);
  
  return sFormattedCurrency;
};

/**
 * Capitalize first letter of a string
 * @param sText - The string to capitalize
 * @returns sResult - The capitalized string
 */
export const capitalize = (sText: string): string => {
  if (!sText) return '';
  const sResult = sText.charAt(0).toUpperCase() + sText.slice(1).toLowerCase();
  return sResult;
};
