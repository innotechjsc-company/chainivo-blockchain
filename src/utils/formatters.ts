/**
 * Utils cho format number, currency, price
 */

/**
 * Format so - gioi han hien thi toi da 8 chu so
 *
 * @param value - Gia tri can format (number, null, undefined)
 * @returns String da format
 *
 * @example
 * formatNumber(1234) → "1234"
 * formatNumber(12345678) → "12345678"
 * formatNumber(123456789) → "123M"
 * formatNumber(1234567) → "1.2M"
 * formatNumber(12345) → "12.3K"
 * formatNumber(1234567890) → "1.2B"
 */
export function formatNumber(value: number | null | undefined): string {
  // Xu ly gia tri null/undefined
  if (!value && value !== 0) return "0";

  const valueStr = value.toString();

  // Neu nho hon hoac bang 8 chu so: hien thi day du
  if (valueStr.length <= 8) {
    return valueStr;
  }

  // Neu lon hon 8 chu so: rut gon theo don vi
  // Billions (1,000,000,000+)
  if (value >= 1_000_000_000) {
    const billions = value / 1_000_000_000;
    return billions >= 10
      ? `${Math.floor(billions)}B`
      : `${billions.toFixed(1)}B`;
  }

  // Millions (1,000,000+)
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return millions >= 10
      ? `${Math.floor(millions)}M`
      : `${millions.toFixed(1)}M`;
  }

  // Thousands (1,000+)
  if (value >= 1_000) {
    const thousands = value / 1_000;
    return thousands >= 10
      ? `${Math.floor(thousands)}K`
      : `${thousands.toFixed(1)}K`;
  }

  // Fallback: cat 8 ky tu dau + "..."
  return valueStr.slice(0, 8) + "...";
}

/**
 * Format currency voi don vi tien te
 *
 * @param value - Gia tri
 * @param currency - Don vi tien te (CAN, USDT, etc.)
 * @returns String da format voi don vi
 *
 * @example
 * formatCurrency(1234567, "CAN") → "1.2M CAN"
 * formatCurrency(999, "USDT") → "999 USDT"
 */
export function formatCurrency(
  value: number | null | undefined,
  currency: string = "CAN"
): string {
  const formattedValue = formatNumber(value);
  return `${formattedValue} ${currency.toUpperCase()}`;
}
