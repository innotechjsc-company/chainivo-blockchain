/**
 * Utils cho format number, currency, price
 */

/**
 * Format so voi dau phan cach hang nghin (.) va thap phan (,)
 * Neu so qua lon (>= 1 ty hoac >= 9 chu so): rut gon thanh K/M/B
 *
 * @param value - Gia tri can format (number, null, undefined)
 * @param decimals - So chu so thap phan (mac dinh: 0)
 * @returns String da format
 *
 * @example
 * formatNumber(1234) → "1.234"
 * formatNumber(1234567) → "1.234.567"
 * formatNumber(1234.56, 2) → "1.234,56"
 * formatNumber(123456789) → "123M"
 * formatNumber(1234567890) → "1,2B"
 * formatNumber(12345) → "12.345"
 */
export function formatNumber(
  value: number | null | undefined,
  decimals: number = 0
): string {
  // Xu ly gia tri null/undefined
  if (value === null || value === undefined) return "0";
  if (isNaN(value)) return "0";

  const absValue = Math.abs(value);
  const isNegative = value < 0;

  // Neu >= 1 billion: rut gon thanh B
  if (absValue >= 1_000_000_000) {
    const billions = absValue / 1_000_000_000;
    const formatted = billions >= 10
      ? `${Math.floor(billions)}B`
      : `${billions.toFixed(1).replace('.', ',')}B`;
    return isNegative ? `-${formatted}` : formatted;
  }

  // Neu >= 1 million: rut gon thanh M
  if (absValue >= 1_000_000) {
    const millions = absValue / 1_000_000;
    const formatted = millions >= 10
      ? `${Math.floor(millions)}M`
      : `${millions.toFixed(1).replace('.', ',')}M`;
    return isNegative ? `-${formatted}` : formatted;
  }

  // Neu >= 10,000: rut gon thanh K
  if (absValue >= 10_000) {
    const thousands = absValue / 1_000;
    const formatted = thousands >= 10
      ? `${Math.floor(thousands)}K`
      : `${thousands.toFixed(1).replace('.', ',')}K`;
    return isNegative ? `-${formatted}` : formatted;
  }

  // Neu < 10,000: format day du voi dau phan cach
  const fixedValue = decimals > 0 ? absValue.toFixed(decimals) : Math.round(absValue);
  const [integerPart, decimalPart] = fixedValue.toString().split(".");

  // Them dau phan cach hang nghin (.) cho phan nguyen
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Neu co phan thap phan, them dau phay (,)
  let result = decimalPart ? `${formattedInteger},${decimalPart}` : formattedInteger;

  return isNegative ? `-${result}` : result;
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
