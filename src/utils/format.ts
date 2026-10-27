export const formatNumber = (amount: number): string => amount.toLocaleString('id-ID');

export const formatRupiah = (amount: number): string => `Rp ${formatNumber(amount)}`;

/** "−2.000" style with a real minus sign, as used on the order receipt. */
export const formatNegative = (amount: number): string => `−${formatNumber(amount)}`;

export const formatReceiptTime = (date: Date = new Date()): string => {
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/** Greedy breakdown of change into Indonesian notes/coins, largest first. */
const DENOMINATIONS = [100000, 50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100];

export const breakDownChange = (amount: number): { value: number; count: number }[] => {
  const result: { value: number; count: number }[] = [];
  let rest = amount;
  for (const value of DENOMINATIONS) {
    const count = Math.floor(rest / value);
    if (count > 0) {
      result.push({ value, count });
      rest -= count * value;
    }
  }
  return result;
};
