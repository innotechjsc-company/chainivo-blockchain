/**
 * Utils cho format number, currency, price
 */

/**
 * Format so voi dau phan cach hang nghin (,) va thap phan (.)
 * Neu so qua lon (>= 10K): rut gon thanh K/M/B voi dau phan cach
 *
 * @param value - Gia tri can format (number, null, undefined)
 * @param decimals - So chu so thap phan (mac dinh: 0)
 * @returns String da format
 *
 * @example
 * formatNumber(1234) → "1,234"
 * formatNumber(9999) → "9,999"
 * formatNumber(10000) → "10K"
 * formatNumber(15500) → "15.5K"
 * formatNumber(1234567) → "1.2M"
 * formatNumber(12345678) → "12M"
 * formatNumber(123456789) → "123M"
 * formatNumber(1234567890) → "1.2B"
 * formatNumber(12345678901) → "12B"
 * formatNumber(1234.56, 2) → "1,234.56"
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
    // Format phan so truoc, roi them 'B'
    const numberPart = billions >= 10
      ? Math.floor(billions).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : billions.toFixed(1);
    return isNegative ? `-${numberPart}B` : `${numberPart}B`;
  }

  // Neu >= 1 million: rut gon thanh M
  if (absValue >= 1_000_000) {
    const millions = absValue / 1_000_000;
    // Format phan so truoc, roi them 'M'
    const numberPart = millions >= 10
      ? Math.floor(millions).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : millions.toFixed(1);
    return isNegative ? `-${numberPart}M` : `${numberPart}M`;
  }

  // Neu >= 10,000: rut gon thanh K
  if (absValue >= 10_000) {
    const thousands = absValue / 1_000;
    // Format phan so truoc, roi them 'K'
    const numberPart = thousands >= 10
      ? Math.floor(thousands).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : thousands.toFixed(1);
    return isNegative ? `-${numberPart}K` : `${numberPart}K`;
  }

  // Neu < 10,000: format day du voi dau phan cach
  const fixedValue = decimals > 0 ? absValue.toFixed(decimals) : Math.round(absValue);
  const [integerPart, decimalPart] = fixedValue.toString().split(".");

  // Them dau phan cach hang nghin (,) cho phan nguyen
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Neu co phan thap phan, them dau cham (.)
  let result = decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;

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
