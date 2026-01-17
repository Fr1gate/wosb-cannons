/**
 * Formats a number with up to 1 decimal place, hiding decimal part for whole numbers
 * @param {number | null | undefined} value - The value to format
 * @returns {string} Formatted value or "—" for null/undefined
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return "—";
  }
  
  const num = Number(value);
  
  // Check if it's a whole number
  if (Number.isInteger(num)) {
    return num.toString();
  }
  
  // Format with 1 decimal place
  return num.toFixed(1);
};

/**
 * Formats a value for display (returns as-is for non-numbers)
 * @param {any} value - The value to format
 * @returns {string} Formatted value or "—" for null/undefined
 */
export const formatValue = (value) => {
  if (value === null || value === undefined) {
    return "—";
  }
  
  // If it's a number, use formatNumber
  if (typeof value === "number" && !isNaN(value)) {
    return formatNumber(value);
  }
  
  return value.toString();
};

