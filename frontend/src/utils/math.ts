import type { HomeZipcode } from '../types';

interface QuintileThresholds {
  [key: string]: string;
}

export const calculateQuintileThresholds = (
  zipcodes: HomeZipcode[]
): QuintileThresholds => {
  if (!zipcodes || zipcodes.length === 0) {
    return {};
  }

  const sortedZipcodes = [...zipcodes].sort((a, b) => a.value - b.value);
  const totalValue = sortedZipcodes.reduce((sum, z) => sum + z.value, 0);

  if (totalValue === 0) return {};

  const thresholds: QuintileThresholds = {};
  const quintiles = [20, 40, 60, 80, 100];
  let cumulativeValue = 0;
  let lastPercentage = 0;
  let zipIndex = 0;

  for (const quintile of quintiles) {
    const targetValue = totalValue * (quintile / 100);
    while (cumulativeValue < targetValue && zipIndex < sortedZipcodes.length) {
      cumulativeValue += sortedZipcodes[zipIndex].value;
      zipIndex++;
    }

    const currentPercentage = (cumulativeValue / totalValue) * 100;
    const rangeKey = `${quintile - 20}-${quintile}`;
    thresholds[rangeKey] =
      `${lastPercentage.toFixed(1)}% - ${currentPercentage.toFixed(1)}%`;
    lastPercentage = currentPercentage;
  }

  const finalKey = '80-100';
  if (thresholds[finalKey]) {
    const parts = thresholds[finalKey].split(' - ');
    thresholds[finalKey] = `${parts[0]} - 100.0%`;
  }

  return thresholds;
};
